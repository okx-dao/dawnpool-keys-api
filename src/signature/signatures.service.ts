import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExitSignatureRepository } from './exit-signature.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ExitSignatureEntity } from '../entities/exit-signature.entity';
import { EntityManager } from '@mikro-orm/core';
import { ExitMessage } from '../common/ExitMessage';
import { VerifyExitMessageService } from '../verify-exit-message';
import { EncryptorService } from '../encryptor';
import { ExitLogDTO } from './dto';
import { ExecutionApisService } from '../execution-apis';
import { BeaconApisService } from '../beacon-apis';

@Injectable()
export class SignaturesService {
  constructor(
    @InjectRepository(ExitSignatureEntity)
    protected readonly repository: ExitSignatureRepository,
    @Inject(Logger)
    protected readonly logger: Logger,
    @Inject(EntityManager)
    private readonly em: EntityManager,
    private readonly verify: VerifyExitMessageService,
    @Inject(EncryptorService)
    private readonly encryptor: EncryptorService,
    @Inject(ExecutionApisService)
    protected readonly executionApis: ExecutionApisService,
    @Inject(BeaconApisService)
    protected readonly beaconApis: BeaconApisService,
  ) {}

  async findOne(index: number) {
    return await this.repository.findOne({ index });
  }

  async updateSignatures(exitMessages: ExitMessage[]) {
    const { verifiedMessages, notVerifiedMessages } =
      await this.verify.verifyExitMessages(exitMessages);
    const entities: ExitSignatureEntity[] = [];
    const updatedMessages: {
      validator_index: string;
      public_key: string;
    }[] = [];
    for (const message of verifiedMessages) {
      const encrypted = await this.encryptor.encrypt(
        JSON.stringify(message.exitMessage),
      );
      if (encrypted) {
        entities.push(
          await this.repository.create({
            index: message.dawnIndex,
            epoch: parseInt(message.exitMessage.message.epoch),
            isExited: false,
            encryptedSignature: encrypted,
          }),
        );
        updatedMessages.push({
          validator_index: message.exitMessage.message.validator_index,
          public_key: message.public_key,
        });
      }
    }
    if (entities.length > 0) {
      await this.em.upsertMany(entities);
    }
    return { updatedMessages, notVerifiedMessages };
  }

  async validatorExit(exitLog: ExitLogDTO) {
    const { index, operator, pubkey } = exitLog;
    const validator = await this.executionApis.getNodeValidatorByPubkey(pubkey);
    const res = { success: false, error: '' };
    if (operator !== validator.operator || index !== validator.index) {
      this.logger.error(
        `Unmatched validator, log: ${JSON.stringify(
          exitLog,
        )}, validator: ${JSON.stringify(validator)}`,
      );
      res.error = 'Unmatched validator';
      return res;
    }
    if (validator.status != DawnValidatorStatus.EXITING) {
      this.logger.warn(
        `Unmatched validator status: ${JSON.stringify(validator)}`,
      );
    }
    const result = await this.repository.findOne({ index });
    if (!result || !result.encryptedSignature) {
      this.logger.error(`Can't find validator, index: ${index}`);
      res.error = "Can't find validator";
      return res;
    }
    if (!result.isExited) {
      result.isExited = true;
      await this.em.upsert(result);
    }
    const decrypted = await this.encryptor.decrypt(result.encryptedSignature);
    const exitMessage: ExitMessage = JSON.parse(decrypted);
    return await this.beaconApis.voluntaryExit(exitMessage);
  }
}

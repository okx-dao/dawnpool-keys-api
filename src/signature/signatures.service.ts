import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExitSignatureRepository } from './exit-signature.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ExitSignatureEntity } from '../entities/exit-signature.entity';
import { EntityManager } from '@mikro-orm/core';
import { ExitMessage } from '../common/ExitMessage';
import { VerifyExitMessageService } from '../verify-exit-message';
import { EncryptorService } from '../encryptor';

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
  ) {}

  async findOne(index: number) {
    const result = await this.repository.findOne({ index });
    return result;
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
    await this.em.upsertMany(entities);
    return { updatedMessages, notVerifiedMessages };
  }
}

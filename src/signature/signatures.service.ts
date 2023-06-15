import { Inject, Injectable, Logger } from '@nestjs/common';
import { Signature } from './interfaces/signature.interface';
import { ExitSignatureRepository } from './exit-signature.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ExitSignatureEntity } from '../entities/exit-signature.entity';
import { EntityManager } from '@mikro-orm/core';
import { ExitMessage } from "../common/ExitMessage";

@Injectable()
export class SignaturesService {
  constructor(
    @InjectRepository(ExitSignatureEntity)
    protected readonly repository: ExitSignatureRepository,
    @Inject(Logger)
    protected readonly logger: Logger,
    private readonly em: EntityManager,
  ) {}

  async findAll() {
    const result = await this.repository.findAll();
    return result;
  }

  async findOne(index: number) {
    const result = await this.repository.findOne({ index });
    return result;
  }

  /* Test command
   * curl -X POST -d '{"index": 2,"epoch":1,"isExited":false, "encryptedSignature": "0x123456"}' -H "Content-Type: application/json" http://127.0.0.1:3000/signatures/update
   * */

  async updateSignatures(exitMessages: ExitMessage[]) {
    for (const exitMessage of exitMessages) {
      if (await this.checkExitMessage(exitMessage)) {
      }
    }
    // const result = this.repository.create({ ...signature });
    // await this.em.persistAndFlush(result);
    return '{}';
  }

  async checkExitMessage(exitMessage: ExitMessage) {

    return true;
  }
}

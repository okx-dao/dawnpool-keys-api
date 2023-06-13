import { Inject, Injectable, Logger } from '@nestjs/common';
import { Signature } from './interfaces/signature.interface';
import { ExitSignatureRepository } from './exit-signature.repository';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ExitSignatureEntity } from '../entities/exit-signature.entity';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class SignaturesService {
  constructor(
    @InjectRepository(ExitSignatureEntity)
    protected readonly repository: ExitSignatureRepository,
    @Inject(Logger)
    protected readonly logger: Logger,
    private readonly em: EntityManager,
  ) {}
  private readonly signatures: Signature[] = [];

  create(signature: Signature): number {
    this.signatures.push(signature);
    return this.signatures.length - 1;
  }

  async findAll() {
    const result = await this.repository.findAll();
    this.logger.log(result);
    return result;
  }

  // findOne(id: number): Signature {
  //   return this.signatures[id];
  // }

  async findOne(index: number) {
    try {
      const result = await this.repository.findOne({ index });
      return result;
    } catch (e) {
      this.logger.error(e);
      return e;
    }
  }

  /* Test command
   * curl -X POST -d '{"index": 2,"epoch":1,"isExited":false, "encryptedSignature": "0x123456"}' -H "Content-Type: application/json" http://127.0.0.1:3000/signatures/update
   * */

  async setOne(signature: Signature) {
    const result = this.repository.create({ ...signature });
    await this.em.persistAndFlush(result);
    return result;
  }

  private buildSignatureRO(signature: ExitSignatureEntity) {
    return {
      index: signature.index,
      epoch: signature.epoch,
      isExited: signature.isExited,
      encryptedSignature: signature.encryptedSignature,
    };
  }
}

import { create, decrypt } from '@chainsafe/bls-keystore';
import { toUtf8Bytes } from 'ethers';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EncryptedDto } from "./encrypted.dto";

@Injectable()
export class EncryptorService {
  constructor(
    @Inject(ConfigService)
    protected readonly config: ConfigService,
    @Inject(Logger)
    protected readonly logger: Logger,
  ) {
    this.ENCRYPT_PASSWORD = config.get('ENCRYPT_PASSWORD');
  }
  private readonly ENCRYPT_PASSWORD: string;

  async encrypt(message: string) {
    if (!this.ENCRYPT_PASSWORD) {
      throw new Error('ENCRYPT_PASSWORD not defined');
    }
    const origin = toUtf8Bytes(message);
    const pubkey = new Uint8Array();
    const path = '';
    const encrypted = await create(this.ENCRYPT_PASSWORD, origin, pubkey, path);
    return JSON.stringify(encrypted).toString();
  }

  async decrypt(encrypted: EncryptedDto) {
    if (!this.ENCRYPT_PASSWORD) {
      throw new Error('ENCRYPT_PASSWORD not defined');
    }
    const content = await decrypt({ ...encrypted }, this.ENCRYPT_PASSWORD);
    const decrypted = new TextDecoder().decode(content);
    return decrypted;
  }
}

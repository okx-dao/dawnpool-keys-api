import { create, decrypt } from '@chainsafe/bls-keystore';
import { toUtf8Bytes } from 'ethers';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
      return message;
    }
    const origin = toUtf8Bytes(message);
    const pubkey = new Uint8Array();
    const path = '';
    const encrypted = await create(this.ENCRYPT_PASSWORD, origin, pubkey, path);
    return JSON.stringify(encrypted);
  }

  async decrypt(encrypted: string) {
    if (!this.ENCRYPT_PASSWORD) {
      return encrypted;
    }
    const content = await decrypt(JSON.parse(encrypted), this.ENCRYPT_PASSWORD);
    return new TextDecoder().decode(content);
  }
}

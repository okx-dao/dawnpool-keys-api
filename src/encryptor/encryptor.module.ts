import { Logger, Module } from '@nestjs/common';
import { EncryptorService } from './encryptor.service';
import { ConfigService } from '@nestjs/config';
// import { EncryptorController } from './encryptor.controller';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService, EncryptorService, Logger],
  exports: [EncryptorService],
})
export class EncryptorModule {}

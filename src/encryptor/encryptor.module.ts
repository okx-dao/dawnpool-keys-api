import { Logger, Module } from '@nestjs/common';
import { EncryptorService } from './encryptor.service';
import { ConfigService } from '@nestjs/config';
// import { EncryptorController } from './encryptor.controller';

@Module({
  imports: [],
  controllers: [],
  providers: [EncryptorService, ConfigService, Logger],
  exports: [EncryptorService],
})
export class EncryptorModule {}

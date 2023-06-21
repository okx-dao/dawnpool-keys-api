import { Logger, Module } from '@nestjs/common';
import { SignaturesController } from './signatures.controller';
import { SignaturesService } from './signatures.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExitSignatureEntity } from '../entities/exit-signature.entity';
import { ExitSignatureRepository } from './exit-signature.repository';
import { VerifyExitMessageService } from '../verify-exit-message';
import { EncryptorService } from '../encryptor';
import { BeaconApisModule } from '../beacon-apis';
import { ExecutionApisModule } from '../execution-apis';

@Module({
  imports: [
    MikroOrmModule.forFeature([ExitSignatureEntity]),
    BeaconApisModule,
    ExecutionApisModule,
  ],
  controllers: [SignaturesController],
  providers: [
    SignaturesService,
    ExitSignatureRepository,
    VerifyExitMessageService,
    EncryptorService,
    Logger,
  ],
})
export class SignaturesModule {}

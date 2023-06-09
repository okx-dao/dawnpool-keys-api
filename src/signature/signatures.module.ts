import { Logger, Module } from '@nestjs/common';
import { SignaturesController } from './signatures.controller';
import { SignaturesService } from './signatures.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExitSignatureEntity } from '../entities/exit-signature.entity';
import { ExitSignatureRepository } from './exit-signature.repository';

@Module({
  imports: [MikroOrmModule.forFeature([ExitSignatureEntity])],
  controllers: [SignaturesController],
  providers: [SignaturesService, ExitSignatureRepository, Logger],
})
export class SignaturesModule {}

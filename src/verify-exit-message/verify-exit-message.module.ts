import { Logger, Module } from '@nestjs/common';
import { VerifyExitMessageService } from './verify-exit-message.service';
import { VerifyExitMessageController } from './verify-exit-message.controller';
import { BeaconApisService } from '../beacon-apis/beacon-apis.service';

@Module({
  imports: [],
  controllers: [VerifyExitMessageController],
  providers: [VerifyExitMessageService, BeaconApisService, Logger],
})
export class VerifyExitMessageModule {}

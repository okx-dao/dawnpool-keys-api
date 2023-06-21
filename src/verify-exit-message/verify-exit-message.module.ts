import { Logger, Module } from '@nestjs/common';
import { VerifyExitMessageService } from './verify-exit-message.service';
// import { VerifyExitMessageController } from './verify-exit-message.controller';
import { BeaconApisService } from '../beacon-apis';
import { ExecutionApisService } from '../execution-apis';

@Module({
  imports: [],
  controllers: [],
  providers: [
    VerifyExitMessageService,
    BeaconApisService,
    ExecutionApisService,
    Logger,
  ],
})
export class VerifyExitMessageModule {}

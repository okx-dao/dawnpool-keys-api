import { Body, Controller, Post } from '@nestjs/common';
import { VerifyExitMessageService } from './verify-exit-message.service';
import { ExitMessage } from '../common/ExitMessage';

@Controller('verify')
export class VerifyExitMessageController {
  constructor(private readonly verify: VerifyExitMessageService) {}

  @Post()
  verifyOneSignature(@Body() exitMessage: ExitMessage) {
    return this.verify.verifyExitMessage(exitMessage);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { VerifyExitMessageService } from './verify-exit-message.service';
import { ExitMessage } from '../common/ExitMessage';

@Controller('verify')
export class VerifyExitMessageController {
  constructor(private readonly verify: VerifyExitMessageService) {}

  // curl -X POST -d '{"message":{"epoch":"182698","validator_index":"486048"},"signature":"0xb5e49ec8157a50a8da21e2d76074a0d89c3c3e2cb79627fc8fe735118dce0f32c6f2cd4523b3372025ef4a72e4250995061c79ceb80876711e2640e57048b4a123857ebbec0380087ea1371272b53ea10220fa4e62f9cbcc40ba089b8fbb6506"}' -H "Content-Type: application/json" http://127.0.0.1:3000/verify

  @Post()
  verifyOneSignature(@Body() exitMessage: ExitMessage) {
    return this.verify.verifyExitMessage(exitMessage);
  }
}

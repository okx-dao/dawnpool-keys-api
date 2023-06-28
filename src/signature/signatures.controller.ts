import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { ExitMessage } from '../common/ExitMessage';
import { AuthGuard } from '../auth';
import { ExitLogDTO } from './dto';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @UseGuards(AuthGuard)
  @Get(':index')
  findOne(@Param('index', ParseIntPipe) index: number) {
    return this.signaturesService.findOne(index);
  }

  @Post('update')
  update(@Body() exitMessages: ExitMessage[]) {
    return this.signaturesService.updateSignatures(exitMessages);
  }

  @UseGuards(AuthGuard)
  @Post('exit')
  validatorExit(@Body() exitLog: ExitLogDTO) {
    return this.signaturesService.validatorExit(exitLog);
  }
}

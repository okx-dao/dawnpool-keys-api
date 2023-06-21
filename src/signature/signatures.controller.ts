import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SignaturesService } from './signatures.service';
import { ExitMessage } from '../common/ExitMessage';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Get(':index')
  findOne(@Param('index', ParseIntPipe) index: number) {
    return this.signaturesService.findOne(index);
  }

  @Post('update')
  update(@Body() exitMessages: ExitMessage[]) {
    return this.signaturesService.updateSignatures(exitMessages);
  }
}

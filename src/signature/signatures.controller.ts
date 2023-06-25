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

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  // curl -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiMHgxMTVBRkI0MWU3MDRGMkQwOTVDYzQ3MWY4ZUM3RUNFYUYyMGEyOGM5IiwibWVzc2FnZSI6InRlc3QxMjM0IiwiaWF0IjoxNjg3NjgwNDExLCJleHAiOjE2ODc2ODA0NzF9.YtjI2FZFdfl3KfMdhRMq7GHTLCwYOrfDbOc8qUZ3lGI' 'http://127.0.0.1:3000/api/v1/signatures/0'
  @UseGuards(AuthGuard)
  @Get(':index')
  findOne(@Param('index', ParseIntPipe) index: number) {
    return this.signaturesService.findOne(index);
  }

  @Post('update')
  update(@Body() exitMessages: ExitMessage[]) {
    return this.signaturesService.updateSignatures(exitMessages);
  }
}

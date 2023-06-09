import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UpdateSignatureDto } from './update-signature.dto';
import { SignaturesService } from './signatures.service';

@Controller('signatures')
export class SignaturesController {
  constructor(private readonly signaturesService: SignaturesService) {}

  @Get()
  findAll(): string {
    const signatures = this.signaturesService.findAll();
    return JSON.stringify(signatures);
  }

  @Get(':index')
  findOne(@Param('index', ParseIntPipe) index: number) {
    return this.signaturesService.findOne(index);
  }

  @Post('create')
  create(@Body() signature: UpdateSignatureDto): number {
    return this.signaturesService.create(signature);
  }

  @Post('update')
  update(@Body() signature: UpdateSignatureDto) {
    return this.signaturesService.setOne(signature);
  }
}

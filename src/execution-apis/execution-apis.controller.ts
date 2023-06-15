import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ExecutionApisService } from './execution-apis.service';

@Controller('node-validators')
export class ExecutionApisController {
  constructor(private readonly executionApi: ExecutionApisService) {}

  @Get(':index')
  getOneValidator(@Param('index', ParseIntPipe) index: number) {
    return this.executionApi.getNodeValidator(index);
  }
}

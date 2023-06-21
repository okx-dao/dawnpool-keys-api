import { Logger, Module } from '@nestjs/common';
import { ExecutionApisService } from './execution-apis.service';
import { ConfigService } from '@nestjs/config';
// import { ExecutionApisController } from './execution-apis.controller';

@Module({
  imports: [],
  controllers: [],
  providers: [ConfigService, ExecutionApisService, Logger],
  exports: [ExecutionApisService],
})
export class ExecutionApisModule {}

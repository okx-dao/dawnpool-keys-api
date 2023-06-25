import { Logger, Module } from '@nestjs/common';
import { ExecutionApisService } from './execution-apis.service';
import { ConfigService } from '@nestjs/config';
import { Web3tService } from '../web3t';
// import { ExecutionApisController } from './execution-apis.controller';

@Module({
  imports: [],
  controllers: [],
  providers: [ExecutionApisService, Web3tService, ConfigService, Logger],
  exports: [ExecutionApisService],
})
export class ExecutionApisModule {}

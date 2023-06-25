import { Logger, Module } from '@nestjs/common';
import { Web3tService } from './web3t.service';

@Module({
  providers: [Web3tService, Logger],
  exports: [Web3tService],
})
export class Web3tModule {}

import { Logger, Module } from '@nestjs/common';
import { BeaconApisService } from './beacon-apis.service';
import { ConfigService } from '@nestjs/config';
// import { BeaconApisController } from './beacon-apis.controller';

@Module({
  imports: [],
  controllers: [],
  providers: [BeaconApisService, ConfigService, Logger],
  exports: [BeaconApisService],
})
export class BeaconApisModule {}

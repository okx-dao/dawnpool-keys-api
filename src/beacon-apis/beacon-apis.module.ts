import { Module } from '@nestjs/common';
import { BeaconApisService } from './beacon-apis.service';
import { ConfigService } from '@nestjs/config';
import { BeaconApisController } from './beacon-apis.controller';

@Module({
  imports: [],
  controllers: [BeaconApisController],
  providers: [ConfigService, BeaconApisService],
  exports: [BeaconApisService],
})
export class BeaconApisModule {}

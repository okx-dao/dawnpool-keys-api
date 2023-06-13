import { Controller, Get, Param } from '@nestjs/common';
import { BeaconApisService } from './beacon-apis.service';

@Controller('validators')
export class BeaconApisController {
  constructor(private readonly beaconApis: BeaconApisService) {}

  @Get(':index')
  getOneValidator(@Param('index') index: string) {
    return this.beaconApis.getOneValidator(index);
  }

  @Get('genesis')
  getGenesis() {
    return this.beaconApis.getGenesis();
  }

  @Get('state')
  getState() {
    return this.beaconApis.getState();
  }
}

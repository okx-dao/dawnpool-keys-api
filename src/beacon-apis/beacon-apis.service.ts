import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { genesisDTO, validatorInfoDTO, stateDTO } from './dto';

@Injectable()
export class BeaconApisService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {
    this.beaconNode = this.config.get('CL_API_URLS');
  }
  private readonly beaconNode: string;

  async getOneValidator(validator_index: string) {
    const url = `${this.beaconNode}/eth/v1/beacon/states/head/validators/${validator_index}`;
    // 获取fetch的数据并返回
    const res = await fetch(url);
    const data = await res.json();
    const validator: validatorInfoDTO = data.data;
    if (!validator) {
      throw new Error(
        `Get validator ${validator_index} failed, res: ${JSON.stringify(data)}`,
      );
    }
    return validator;
  }

  async getGenesis() {
    const url = `${this.beaconNode}/eth/v1/beacon/genesis`;
    // 获取fetch的数据并返回
    const res = await fetch(url);
    const data = await res.json();
    const genesis: genesisDTO = data.data;
    if (!genesis) {
      throw new Error(`Get genesis failed, res: ${JSON.stringify(data)}`);
    }
    return genesis;
  }

  async getState() {
    const url = `${this.beaconNode}/eth/v1/beacon/states/finalized/fork`;
    // 获取fetch的数据并返回
    const res = await fetch(url);
    const data = await res.json();
    const state: stateDTO = data.data;
    if (!state) {
      throw new Error(`Get state failed, res: ${JSON.stringify(data)}`);
    }
    return state;
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  genesisDTO,
  validatorInfoDTO,
  stateDTO,
  FinalityCheckpointsDTO,
} from './dto';
import { ExitMessage } from '../common/ExitMessage';

@Injectable()
export class BeaconApisService {
  constructor(
    @Inject(ConfigService)
    protected readonly config: ConfigService,
    @Inject(Logger)
    protected readonly logger: Logger,
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
    this.logger.log(`Got beacon validator: ${JSON.stringify(validator)}`);
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
    this.logger.log(`Got beacon genesis: ${JSON.stringify(genesis)}`);
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
    this.logger.log(`Got beacon state: ${JSON.stringify(state)}`);
    return state;
  }

  async getHeadFinalityCheckpoints() {
    const url = `${this.beaconNode}/eth/v1/beacon/states/head/finality_checkpoints`;
    // 获取fetch的数据并返回
    const res = await fetch(url);
    const data = await res.json();
    const checkpoints: FinalityCheckpointsDTO = data.data;
    if (!checkpoints) {
      throw new Error(
        `Get finality_checkpoints failed, res: ${JSON.stringify(data)}`,
      );
    }
    this.logger.log(
      `Got finality_checkpoints state: ${JSON.stringify(checkpoints)}`,
    );
    return checkpoints;
  }

  async voluntaryExit(exitMessage: ExitMessage) {
    const url = `${this.beaconNode}/eth/v1/beacon/pool/voluntary_exits`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exitMessage),
    });
    const result = await res.text();
    if (!res.ok) {
      throw new Error(
        `Voluntary exit failed, validator_index: ${exitMessage.message.validator_index}, message: ${result}`,
      );
    } else {
      this.logger.log(
        `Voluntary exit succeeded, validator_index: ${exitMessage.message.validator_index}, message: ${result}`,
      );
    }
    return result;
  }
}

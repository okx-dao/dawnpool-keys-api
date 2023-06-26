import { Inject, Injectable, Logger } from '@nestjs/common';
import { BeaconApisService } from '../beacon-apis';
import { ExitMessage } from '../common/ExitMessage';
import { ExecutionApisService } from '../execution-apis';
import { ZeroAddress } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyExitMessageService {
  constructor(
    @Inject(Logger)
    protected readonly logger: Logger,
    @Inject(BeaconApisService)
    protected readonly beaconApis: BeaconApisService,
    @Inject(ExecutionApisService)
    protected readonly executionApis: ExecutionApisService,
    @Inject(ConfigService)
    protected readonly config: ConfigService,
  ) {
    this.hardForkEpoch = config.get('HARD_FORK_EPOCH');
  }

  protected hardForkEpoch: number;
  protected ssz: any;
  protected bls: any;
  protected computeDomain: any;
  protected computeSigningRoot: any;
  protected DOMAIN_VOLUNTARY_EXIT: Uint8Array;
  protected FAR_FUTURE_EPOCH: number;
  protected fromHex: any;

  async loadChainsafe() {
    if (this.ssz) {
      return;
    }
    const { ssz } = await import('@lodestar/types');
    this.ssz = ssz;
    this.bls = (await import('@chainsafe/bls')).default;
    const { computeDomain, computeSigningRoot } = await import(
      '@lodestar/state-transition'
    );
    this.computeDomain = computeDomain;
    this.computeSigningRoot = computeSigningRoot;
    const { DOMAIN_VOLUNTARY_EXIT, FAR_FUTURE_EPOCH } = await import(
      '@lodestar/params'
    );
    this.DOMAIN_VOLUNTARY_EXIT = DOMAIN_VOLUNTARY_EXIT;
    this.FAR_FUTURE_EPOCH = FAR_FUTURE_EPOCH;
    const { fromHex } = await import('@lodestar/utils');
    this.fromHex = fromHex;
  }

  async verifyExitMessage(exitMessage: ExitMessage) {
    await this.loadChainsafe();
    const genesis = await this.beaconApis.getGenesis();
    const state = await this.beaconApis.getState();
    return await this.verify(genesis, state, exitMessage);
  }

  async verifyExitMessages(exitMessages: ExitMessage[]) {
    await this.loadChainsafe();
    const genesis = await this.beaconApis.getGenesis();
    const state = await this.beaconApis.getState();
    const { current_justified } =
      await this.beaconApis.getHeadFinalityCheckpoints();
    const verifiedMessages: {
      dawnIndex: number;
      public_key: string;
      exitMessage: ExitMessage;
    }[] = [];
    const notVerifiedMessages: {
      validator_index: string;
      public_key: string;
      error: string;
    }[] = [];
    for (const exitMessage of exitMessages) {
      // check params
      if (parseInt(exitMessage.message.epoch) < this.hardForkEpoch) {
        notVerifiedMessages.push({
          validator_index: exitMessage.message.validator_index,
          public_key: '',
          error: 'Exit epoch too small',
        });
        continue;
      }

      if (
        parseInt(exitMessage.message.epoch) > parseInt(current_justified.epoch)
      ) {
        notVerifiedMessages.push({
          validator_index: exitMessage.message.validator_index,
          public_key: '',
          error: 'Exit epoch too big',
        });
        continue;
      }

      // verify
      const result = await this.verify(genesis, state, exitMessage);
      if (result.isValid) {
        verifiedMessages.push({
          dawnIndex: result.dawnIndex,
          public_key: result.public_key,
          exitMessage,
        });
      } else {
        notVerifiedMessages.push({
          validator_index: exitMessage.message.validator_index,
          public_key: result.public_key,
          error: result.error,
        });
      }
    }
    return { verifiedMessages, notVerifiedMessages };
  }

  async verify(genesis, state, exitMessage) {
    const { validator_index } = exitMessage.message;
    const result = {
      dawnIndex: 0,
      isValid: false,
      public_key: '',
      isExiting: false,
      error: '',
    };
    try {
      const validatorDto = await this.beaconApis.getOneValidator(
        validator_index,
      );
      result.public_key = validatorDto.validator.pubkey;
      result.isExiting =
        validatorDto.validator.exit_epoch === String(this.FAR_FUTURE_EPOCH);
    } catch (e) {
      result.error = e.message;
      this.logger.error(e.message);
      return result;
    }

    if (result.isExiting) {
      result.error = 'Validator is exiting or exited';
      return result;
    }

    // check if dawn pool validator
    const { index, operator, status } =
      await this.executionApis.getNodeValidatorByPubkey(result.public_key);
    if (!operator || operator === ZeroAddress) {
      result.error = 'Not dawn pool validator';
      return result;
    }
    result.dawnIndex = index;
    if (
      status != DawnValidatorStatus.WAITING_ACTIVATED &&
      status != DawnValidatorStatus.VALIDATING
    ) {
      result.error = 'Dawn pool validator status not match';
      return result;
    }

    // verify signature
    const CURRENT_FORK = this.fromHex(state.current_version);
    // const PREVIOUS_FORK = fromHex(state.previous_version);
    result.isValid = this.verifyFork(
      exitMessage,
      result.public_key,
      CURRENT_FORK,
      genesis,
    );
    // if (!isValid) isValid = verifyFork(PREVIOUS_FORK);
    // if (!isValid) {
    //   return false;
    // }
    if (!result.isValid) {
      result.error = 'Verify signature failed(use current fork version)';
    }
    return result;
  }

  verifyFork(exitMessage, pubkey, fork: Uint8Array, genesis) {
    const GENESIS_VALIDATORS_ROOT = this.fromHex(
      genesis.genesis_validators_root,
    );

    const domain = this.computeDomain(
      this.DOMAIN_VOLUNTARY_EXIT,
      fork,
      GENESIS_VALIDATORS_ROOT,
    );
    const { validator_index, epoch } = exitMessage.message;
    const parsedExit = {
      epoch: parseInt(epoch, 10),
      validatorIndex: parseInt(validator_index, 10),
    };

    const signingRoot = this.computeSigningRoot(
      this.ssz.phase0.VoluntaryExit,
      parsedExit,
      domain,
    );
    const hexPubkey = this.fromHex(pubkey);
    const hexSignature = this.fromHex(exitMessage.signature);
    return this.bls.verify(hexPubkey, signingRoot, hexSignature);
  }
}

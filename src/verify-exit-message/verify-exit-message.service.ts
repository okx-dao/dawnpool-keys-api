import { Inject, Injectable, Logger } from '@nestjs/common';
import { BeaconApisService } from '../beacon-apis/beacon-apis.service';
import { ExitMessage } from '../common/ExitMessage';
// import { ssz } from '@lodestar/types';
// import bls from '@chainsafe/bls';
// import { computeDomain, computeSigningRoot } from '@lodestar/state-transition';
// import { DOMAIN_VOLUNTARY_EXIT, FAR_FUTURE_EPOCH } from '@lodestar/params';
// import { fromHex } from '@lodestar/utils';

@Injectable()
export class VerifyExitMessageService {
  constructor(
    @Inject(Logger)
    protected readonly logger: Logger,
    @Inject(BeaconApisService)
    protected readonly beaconApis: BeaconApisService,
  ) {}

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
    const bls = (await import('@chainsafe/bls')).default;
    this.bls = bls;
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

  async verifyExitMessage(exitMessage: ExitMessage): Promise<boolean> {
    await this.loadChainsafe();
    const genesis = await this.beaconApis.getGenesis();
    const state = await this.beaconApis.getState();
    const { message, signature: rawSignature } = exitMessage;
    const { validator_index, epoch } = message;
    let validatorInfo: { pubkey; isExiting };
    try {
      const { validator } = await this.beaconApis.getOneValidator(
        validator_index,
      );
      validatorInfo = {
        pubkey: validator.pubkey,
        isExiting: validator.exit_epoch === String(this.FAR_FUTURE_EPOCH),
      };
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
    const pubKey = this.fromHex(validatorInfo.pubkey);
    const signature = this.fromHex(rawSignature);

    const GENESIS_VALIDATORS_ROOT = this.fromHex(
      genesis.genesis_validators_root,
    );
    const CURRENT_FORK = this.fromHex(state.current_version);
    // const PREVIOUS_FORK = fromHex(state.previous_version);

    const verifyFork = (fork: Uint8Array) => {
      const domain = this.computeDomain(
        this.DOMAIN_VOLUNTARY_EXIT,
        fork,
        GENESIS_VALIDATORS_ROOT,
      );

      const parsedExit = {
        epoch: parseInt(epoch, 10),
        validatorIndex: parseInt(validator_index, 10),
      };

      const signingRoot = this.computeSigningRoot(
        this.ssz.phase0.VoluntaryExit,
        parsedExit,
        domain,
      );
      const isValid = this.bls.verify(pubKey, signingRoot, signature);
      return isValid;
    };
    const isValid = verifyFork(CURRENT_FORK);
    // if (!isValid) isValid = verifyFork(PREVIOUS_FORK);
    // if (!isValid) {
    //   return false;
    // }
    return isValid;
  }
}

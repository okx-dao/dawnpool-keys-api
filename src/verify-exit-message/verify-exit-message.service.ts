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

  async verifyExitMessage(exitMessage: ExitMessage): Promise<boolean> {
    const { ssz } = await import('@lodestar/types');
    const bls = (await import('@chainsafe/bls')).default;
    const { computeDomain, computeSigningRoot } = await import(
      '@lodestar/state-transition'
    );
    const { DOMAIN_VOLUNTARY_EXIT, FAR_FUTURE_EPOCH } = await import(
      '@lodestar/params'
    );
    const { fromHex } = await import('@lodestar/utils');
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
        isExiting: validator.exit_epoch === String(FAR_FUTURE_EPOCH),
      };
    } catch (e) {
      this.logger.error(e.message);
      return false;
    }
    const pubKey = fromHex(validatorInfo.pubkey);
    const signature = fromHex(rawSignature);

    const GENESIS_VALIDATORS_ROOT = fromHex(genesis.genesis_validators_root);
    const CURRENT_FORK = fromHex(state.current_version);
    // const PREVIOUS_FORK = fromHex(state.previous_version);

    const verifyFork = (fork: Uint8Array) => {
      const domain = computeDomain(
        DOMAIN_VOLUNTARY_EXIT,
        fork,
        GENESIS_VALIDATORS_ROOT,
      );

      const parsedExit = {
        epoch: parseInt(epoch, 10),
        validatorIndex: parseInt(validator_index, 10),
      };

      const signingRoot = computeSigningRoot(
        ssz.phase0.VoluntaryExit,
        parsedExit,
        domain,
      );
      const isValid = bls.verify(pubKey, signingRoot, signature);
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

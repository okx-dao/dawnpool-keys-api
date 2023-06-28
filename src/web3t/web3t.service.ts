import { Inject, Injectable, Logger } from '@nestjs/common';
import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';
import { Web3Account } from 'web3-eth-accounts';

@Injectable()
export class Web3tService {
  constructor(
    @Inject(Logger)
    protected readonly logger: Logger,
    @Inject(ConfigService)
    protected readonly config: ConfigService,
  ) {
    this.executionNode = this.config.get('EL_API_URLS');
    this.web3 = new Web3(this.executionNode);
    // this.account = this.web3.accountProvider.privateKeyToAccount(
    //   this.config.get('PRIVATE_KEY'),
    // );
  }
  private readonly executionNode: string;
  private readonly web3: Web3;
  private readonly account: Web3Account;

  useWeb3() {
    return {
      web3: this.web3,
      account: this.account,
    };
  }
}

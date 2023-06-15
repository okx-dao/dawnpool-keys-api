import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { keccak256, encodePacked } from 'web3-utils';
import { encodeFunctionCall, decodeParameters } from 'web3-eth-abi';

@Injectable()
export class ExecutionApisService {
  constructor(
    @Inject(Logger)
    protected readonly logger: Logger,
    @Inject(ConfigService)
    protected readonly config: ConfigService,
  ) {
    this.executionNode = this.config.get('EL_API_URLS');
    this.web3 = new Web3(this.executionNode);
    this.dawnStorageAddress = this.config.get('DAWN_STORAGE_CONTRACT');
  }
  private readonly executionNode: string;
  private web3: Web3;
  private readonly dawnStorageAddress: string;
  private depositNodeManagerAddress: string;

  async getDepositNodeManagerAddress() {
    if (this.depositNodeManagerAddress) {
      return;
    }
    const encodedData = encodeFunctionCall(
      {
        name: 'getAddress',
        type: 'function',
        inputs: [{ type: 'bytes32', name: 'key' }],
      },
      [keccak256(encodePacked('contract.address', 'DepositNodeManager'))],
    );
    this.logger.log(`DawnStorage address: ${this.dawnStorageAddress}`);
    const returnData = await this.web3.eth.call({
      to: this.dawnStorageAddress,
      data: encodedData,
    });
    const decoded = decodeParameters(['address'], returnData);
    this.depositNodeManagerAddress = decoded[0] as string;
    this.logger.log(
      `DepositNodeManager address: ${this.depositNodeManagerAddress}`,
    );
  }

  async getNodeValidator(index: number) {
    await this.getDepositNodeManagerAddress();
    const encodedData = encodeFunctionCall(
      {
        name: 'getNodeValidator',
        type: 'function',
        inputs: [{ type: 'uint256', name: 'index' }],
      },
      [index],
    );
    const returnData = await this.web3.eth.call({
      to: this.depositNodeManagerAddress,
      data: encodedData,
    });
    const decoded = decodeParameters(['address', 'bytes', 'uint8'], returnData);
    const [operator, pubkey, status] = Object.values(decoded) as [
      string,
      string,
      bigint,
    ];
    this.logger.debug(
      `Get a validator from contract, operator: ${operator}, pubkey: ${pubkey}, status: ${status}`,
    );
    return { operator, pubkey, status: Number(status) };
  }

  async getNodeValidatorByPubkey(pubkey: string) {
    await this.getDepositNodeManagerAddress();
    const encodedData = encodeFunctionCall(
      {
        name: 'getNodeValidator',
        type: 'function',
        inputs: [{ type: 'bytes', name: 'pubkey' }],
      },
      [pubkey],
    );
    const returnData = await this.web3.eth.call({
      to: this.depositNodeManagerAddress,
      data: encodedData,
    });
    const decoded = decodeParameters(
      ['uint256', 'address', 'uint8'],
      returnData,
    );
    const [index, operator, status] = Object.values(decoded) as [
      bigint,
      string,
      bigint,
    ];
    return { index: Number(index), operator, status: Number(status) };
  }
}

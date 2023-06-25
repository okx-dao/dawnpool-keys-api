import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Web3Account } from 'web3-eth-accounts';
import { verifyMessage } from 'ethers';
import { MessageDTO, SignedDTO, SignInDTO } from './dto';
import { UsersService } from '../users';
import { Web3tService } from '../web3t';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService)
    protected readonly config: ConfigService,
    @Inject(UsersService)
    private readonly users: UsersService,
    @Inject(Web3tService)
    private readonly web3t: Web3tService,
    @Inject(Logger)
    private readonly logger: Logger,
    private jwtService: JwtService,
  ) {
    const { account } = web3t.useWeb3();
    this.account = account;
  }
  private account: Web3Account;

  signMessage(message: MessageDTO) {
    this.logger.log(`Sign message: ${JSON.stringify(message)}`);
    return this.account.sign(message.value);
  }

  async signIn(signIn: SignInDTO) {
    const { signer, signed } = signIn;
    if (!this.users.hasUser(signer) || !this.verify(signer, signed)) {
      throw new UnauthorizedException();
    }
    const payload = { address: signer, message: signed.message };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  verify(signer: string, signature: SignedDTO) {
    const recovery = verifyMessage(signature.message, signature);
    return signer === recovery;
  }
}

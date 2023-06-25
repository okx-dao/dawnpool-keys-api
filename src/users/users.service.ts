import {
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Logger)
    protected readonly logger: Logger,
    @Inject(ConfigService)
    protected readonly config: ConfigService,
  ) {
    this.users = config.get('ACCOUNTS');
    this.cookies = new Map();
  }
  private readonly users: string[];
  private readonly cookies: Map<string, string>;

  hasUser(account: string) {
    return this.users.indexOf(account) > -1;
  }
}

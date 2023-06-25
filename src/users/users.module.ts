import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UsersService, ConfigService, Logger],
  exports: [UsersService],
})
export class UsersModule {}

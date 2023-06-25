import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users';
import { ConfigService } from '@nestjs/config';
import { Web3tService } from '../web3t';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      async useFactory(config: ConfigService) {
        return {
          global: true,
          secret: config.get('JWT_SECRET'),
          signOptions: { expiresIn: config.get('JWT_EXPIRES') },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, ConfigService, Web3tService, Logger],
  exports: [AuthService],
})
export class AuthModule {}

import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignaturesModule } from '../signature/signatures.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BeaconApisModule } from '../beacon-apis/beacon-apis.module';
import { VerifyExitMessageModule } from '../verify-exit-message/verify-exit-message.module';
import { EncryptorModule } from '../encryptor/encryptor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // entities: ['./dist/entities'],
        entitiesTs: ['./src/entities'],
        dbName: configService.get('DB_NAME'),
        type: 'postgresql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        autoLoadEntities: true,
        cache: { enabled: false },
        debug: true,
        registerRequestContext: true,
        allowGlobalContext: false,
      }),
      inject: [ConfigService],
    }),
    SignaturesModule,
    BeaconApisModule,
    VerifyExitMessageModule,
    EncryptorModule,
  ],
  providers: [Logger, AppService],
})
export class AppModule {}

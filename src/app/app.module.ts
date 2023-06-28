import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignaturesModule } from '../signature';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from '../auth';
import { Web3tModule } from '../web3t';

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
        debug: configService.get<string>('DB_DEBUG') === 'true',
        registerRequestContext: true,
        allowGlobalContext: false,
      }),
      inject: [ConfigService],
    }),
    Web3tModule,
    AuthModule,
    SignaturesModule,
  ],
  providers: [AppService],
})
export class AppModule {}

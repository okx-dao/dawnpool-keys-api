import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { SignaturesModule } from '../signature/signatures.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot({
      // entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      autoLoadEntities: true,
      dbName: 'dawn_pool_keys_db',
      type: 'postgresql',
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      cache: { enabled: false },
      debug: true,
      allowGlobalContext: false,
    }),
    SignaturesModule,
  ],
  providers: [Logger, AppService],
})
export class AppModule {}

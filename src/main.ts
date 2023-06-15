import { NestFactory } from '@nestjs/core';
import {
  AppModule,
  APP_DESCRIPTION,
  APP_VERSION,
  SWAGGER_URL,
  API_PREFIX, API_VERSION
} from './app';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { transports, format } from 'winston';
import { WinstonModule } from 'nest-winston';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger({
        level: 'debug',
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`;
          }),
        ),
        defaultMeta: { service: 'user-service' },
        transports: [
          //
          // - Write all logs with importance level of `error` or less to `error.log`
          // - Write all logs with importance level of `info` or less to `combined.log`
          //
          new transports.File({ filename: 'error.log', level: 'error' }),
          new transports.File({ filename: 'combined.log' }),
          new transports.Console(),
        ],
      }),
      bufferLogs: true,
    },
  );

  // set route prefixes
  app.setGlobalPrefix(API_PREFIX);

  // logger
  const logger = app.get(Logger);

  // config
  const config = app.get(ConfigService);
  const appPort = config.get('PORT', { infer: true });
  const corsWhitelist = config.get('CORS_WHITELIST_REGEXP', { infer: true });

  // migrating when starting application
  await app.get(MikroORM).getMigrator().up();

  // versions
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: `${API_VERSION}`,
  });

  // enable onShutdownHooks for MikroORM to close DB connection
  // when application exits normally
  app.enableShutdownHooks();

  // handling uncaught exceptions when application exits abnormally
  process.on('uncaughtException', async (error) => {
    logger.log('uncaught exception');
    const orm = app.get(MikroORM);
    if (orm) {
      if (orm.em.isInTransaction()) {
        logger.log('rolling back active DB transactions');
        await orm.em.rollback();
      }

      logger.log('closing DB connection');
      await orm.close();
    }
    logger.log('application will exit in 5 seconds');
    setTimeout(() => process.exit(1), 5000);
    logger.error(error);
  });

  // cors
  if (corsWhitelist !== '') {
    const whitelistRegexp = new RegExp(corsWhitelist);

    app.enableCors({
      origin(origin, callback) {
        if (!origin || whitelistRegexp.test(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    });
  }

  // swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_URL, app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app
  await app.listen(appPort, '0.0.0.0', () =>
    logger.log(`Listening on ${appPort}`),
  );
}

bootstrap().then().catch();

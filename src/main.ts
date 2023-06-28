import { NestFactory } from '@nestjs/core';
import {
  AppModule,
  APP_DESCRIPTION,
  APP_VERSION,
  SWAGGER_URL,
  API_PREFIX,
  API_VERSION,
} from './app';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { transports, format } from 'winston';
import { WinstonModule } from 'nest-winston';
import { MikroORM } from '@mikro-orm/core';
import * as fs from 'fs';

async function bootstrap() {
  // read https
  let httpsOptions;
  if (process.env.ENABLE_HTTPS === 'true') {
    httpsOptions = {
      key: fs.readFileSync(process.env.HTTPS_PRIVATE_KEY),
      cert: fs.readFileSync(process.env.HTTPS_CERT_CHAINS),
    };
  }

  // create app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ https: httpsOptions }),
    {
      // logger: false,
      bufferLogs: true,
    },
  );

  // config
  const config = app.get(ConfigService);

  // set route prefixes
  app.setGlobalPrefix(API_PREFIX);

  // logger
  const logger = WinstonModule.createLogger({
    level: config.get('LOG_LEVEL'),
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
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
  });
  app.useLogger(logger);

  logger.log(new Date().toLocaleString('en-GB'));

  if (process.env.ENABLE_HTTPS === 'true') {
    logger.log(
      `Enable https, ${JSON.stringify({
        key: process.env.HTTPS_PRIVATE_KEY,
        cert: process.env.HTTPS_CERT_CHAINS,
      })}`,
    );
  }
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
  const corsWhitelist = config.get('CORS_WHITELIST_REGEXP', { infer: true });
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
  const appPort = config.get('PORT', { infer: true });
  await app.listen(appPort, '0.0.0.0', () =>
    logger.log(`Listening on ${appPort}`),
  );
}

bootstrap().then().catch();

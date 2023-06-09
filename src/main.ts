import { NestFactory } from '@nestjs/core';
import { AppModule, APP_DESCRIPTION, APP_VERSION, SWAGGER_URL } from './app';
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
        level: 'info',
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

  // logger
  const logger = app.get(Logger);

  // config
  const config = app.get(ConfigService);
  const appPort = config.get('PORT', { infer: true });
  const corsWhitelist = config.get('CORS_WHITELIST_REGEXP', { infer: true });

  // migrating when starting application
  await app.get(MikroORM).getMigrator().up();

  // versions
  app.enableVersioning({ type: VersioningType.URI });

  // enable onShutdownHooks for MikroORM to close DB connection
  // when application exits normally
  app.enableShutdownHooks();

  // handling uncaught exceptions when application exits abnormally
  process.on('uncaughtException', async (error) => {
    logger.error('uncaught exception');
    logger.error('application will exit in 5 seconds');
    setTimeout(() => process.exit(1), 5000);
    logger.error(error.toString());
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
bootstrap();

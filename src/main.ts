import { BadRequestException, ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as express from 'express';
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from 'typeorm-transactional-cls-hooked';
import { AppModule } from './app.module';
import { loadEnviroment } from './env';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';
import { ConfigService } from './shared/service/config.service';
import { SharedModule } from './shared/shared.module';
import { setUpSwagger } from './swagger.setup';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
  loadEnviroment();

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
    }),
  );

  app.use(compression());
  app.use(morgan('combined'));

  app.use('/uploads', express.static('uploads'));


  const configService = app.select(SharedModule).get(ConfigService);

  if (['dev', 'staging'].includes(configService.nodeEnv)) {
    setUpSwagger(app)
  }

  const reflector = app.get(Reflector);
  app.useGlobalFilters(new BadRequestExceptionFilter(reflector));

  // Use class-transform to serilize result return from handler (controller ) to JSON
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      validationError: {
        target: false,
      },
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  // const port = process.env.PORT || 3000;
  const port = configService.getNumber('PORT')

  // console.log(port);
  await app.listen(port);
  Logger.debug(`Application is running on: ${await app.getUrl()}`, 'Main');
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'src/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // attaches cookies to request object
  app.use(cookieParser());
  // applies security hardening settings. using defaults: https://www.npmjs.com/package/helmet
  app.use(helmet());
  await app.listen(1776, () => {
    console.log('Server is running at http://localhost:1776/api/docs/');
  });
}
bootstrap();

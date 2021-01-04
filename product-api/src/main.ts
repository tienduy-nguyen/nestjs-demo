import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { setupSwagger } from 'src/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);
}
bootstrap();

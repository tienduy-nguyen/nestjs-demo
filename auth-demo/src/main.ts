import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from 'src/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.listen(5000, () => {
    console.log('Server running on http://localhost:5000/api/docs');
  });
}
bootstrap();

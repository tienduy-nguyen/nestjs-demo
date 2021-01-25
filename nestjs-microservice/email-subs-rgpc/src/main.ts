import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const user = process.env.RABBITMQ_USER;
  const password = process.env.RABBITMQ_PASSWORD;
  const host = process.env.RABBITMQ_HOST;
  const queueName = process.env.RABBITMQ_QUEUE_NAME;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: queueName,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.startAllMicroservices(() => {
    console.log(
      `Microservice email subscription is running at http://${host}/`,
    );
  });
}
bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from 'src/common/config/ormConfig';
import { SubscriberModule } from 'src/modules/subscriber/subscriber.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(ormConfig()),
    SubscriberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

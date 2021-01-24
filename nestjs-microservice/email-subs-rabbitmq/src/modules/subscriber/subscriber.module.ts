import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriberController } from './subscriber.controller';
import { SubscriberRepository } from './subscriber.repository';
import { SubscriberService } from './subscriber.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriberRepository])],
  controllers: [SubscriberController],
  providers: [SubscriberService],
})
export class SubscriberModule {}

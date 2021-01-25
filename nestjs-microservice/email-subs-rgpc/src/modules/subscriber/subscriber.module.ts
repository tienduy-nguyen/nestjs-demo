import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriberRepository } from './subscriber.repository';
import { SubscriberService } from './subscriber.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriberRepository])],
  controllers: [SubscriberService],
  exports: [],
})
export class SubscriberModule {}

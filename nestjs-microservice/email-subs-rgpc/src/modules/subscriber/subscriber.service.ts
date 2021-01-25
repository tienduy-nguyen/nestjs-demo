import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { SubscriberRepository } from './subscriber.repository';

@Controller()
export class SubscriberService {
  constructor(
    @InjectRepository(SubscriberRepository)
    private subscriberRepo: SubscriberRepository,
  ) {}

  @GrpcMethod()
  public async getSubscribers() {
    return await this.subscriberRepo.getSubscribers();
  }

  @GrpcMethod()
  public async addSubscriber(subscriberDto: CreateSubscriberDto) {
    return await this.subscriberRepo.createSubscriber(subscriberDto);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { SubscriberRepository } from './subscriber.repository';

@Injectable()
export class SubscriberService {
  constructor(private subscriberRepo: SubscriberRepository) {}

  public async getSubscribers() {
    return await this.subscriberRepo.getSubscribers();
  }

  public async addSubscriber(subscriberDto: CreateSubscriberDto) {
    return await this.subscriberRepo.createSubscriber(subscriberDto);
  }
}

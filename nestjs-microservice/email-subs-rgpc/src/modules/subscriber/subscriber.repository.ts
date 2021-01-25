import { EntityRepository, Repository } from 'typeorm';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { Subscriber } from './subscriber.entity';

@EntityRepository(Subscriber)
export class SubscriberRepository extends Repository<Subscriber> {
  public async createSubscriber(subscriberDto: CreateSubscriberDto) {
    const newSubscriber = this.create(subscriberDto);
    await this.save(newSubscriber);
    return newSubscriber;
  }

  public async getSubscribers() {
    return await this.getSubscribers();
  }
}

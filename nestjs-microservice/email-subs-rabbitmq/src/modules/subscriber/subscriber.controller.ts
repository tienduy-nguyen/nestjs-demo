import { Controller } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller()
export class SubscriberController {
  constructor(private subscriberService: SubscriberService) {}

  @MessagePattern({ cmd: 'add-subscriber' })
  public async addSubscriber(@Payload() subscriberDto: CreateSubscriberDto) {
    return await this.subscriberService.addSubscriber(subscriberDto);
  }

  @MessagePattern({ cmd: 'get-subscribers' })
  public async getSubscribers() {
    return this.subscriberService.getSubscribers();
  }
}

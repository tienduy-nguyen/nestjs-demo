## **Using RabbitMQ to communicate with microservices**


NestJS subscribes to the idea that a microservice is an application that uses a different transport layer than HTTP. Therefore, in the above part of this series, we’ve used TCP.

However, with NestJS, we have a broad selection of **transporters** that transmit messages across microservices. Each one of them is different, and it is worth exploring them before making a choice. Conveniently, Nest provides an abstraction for each transport layer, so it is easy to switch them without making significant changes to our code.

Check original article at [Nestjs-Microservice-RabbitMQ](https://wanago.io/2020/11/23/api-nestjs-rabbitmq-microservices/)

### **Introduction to RabbitMQ**

The RabbitMQ is its fundamentals, a message broker that implements the Advanced Message Queuing Protocol (AMQP).

One of the most important concepts to understand is the producer (also called a publisher), whose job is to send the messages. The second important thing is the consumer that waits to receive messages.

Between the producer and the consumer is a queue. When the producer sends the message, it lands in the queue. The producer sends the messages through the exchange, which is a message routing agent.

We can bind the exchange to many different queues. When sending the message, the publisher can send the message to specified queues.

Finally, the consumer picks up the message from the queue and handles it.

Summing up the above:

- the producer sends a message to the exchange,
- the exchange receives the message and routes it to the desired queue,
- the consumer takes the message from the queue and consumes it.

**Advantages of using RabbitMQ with microservices**:

With a message queue, we can send a message from one service to another without knowing if it can handle it. Therefore, we can separate our microservices more and make them less dependant on each other. CloudAMQP, in [its article](https://www.cloudamqp.com/blog/2017-01-03-a-microservice-architecture-built-upon-rabbitmq.html), also mentions that it helped them a lot in keeping the architecture flexible and fixing bugs. When a bug is found, a faulty microservice can be stopped and restarted after it is resolved. The queue of messages might pile quite a bit, but no data is lost.


### **Running RabbitMQ with Docker Compose**


So far in this series, we’ve been using Docker Compose to work with Postgres and Elasticsearch. We can also easily use it to run an instance of RabbitMQ. 

- Let’s add it to our docker-compose.yml file:

  ```yml
  docker-compose.yml
  version: "3"
  services:
    rabbitmq:
      image: rabbitmq:3-management
      container_name: rabbitmq
      hostname: rabbitmq
      volumes:
        - /var/lib/rabbitmq
      ports:
        - "5672:5672"
        - "15672:15672"
      env_file:
        - ./rabbitmq.env
  
  # ...
  ```
  
  Above, you can see that we specify the rabbitmq.env file. We do that to specify the default username and password. Let’s create it and add it to .gitignore along with the .env file.

- `rabbitmq.env`
  ```ts
  RABBITMQ_DEFAULT_USER=admin
  RABBITMQ_DEFAULT_PASS=admin
  .gitignore
  .env
  rabbitmq.env
  # ...
  ```

  In our configuration, we can see two ports exposed:

  - `5672` is the main RabbitMQ port that our NestJS application will use
  - `15672` is the port of the management plugin. It provides an interface that lets us manage and monitor our RabbitMQ instance

### **Using RabbitMQ with NestJS**

Using RabbitMQ with microservices in NestJS is straightforward, thanks to the transporter built into the NestJS framework. 

- We need to install some additional dependencies, though.
  ```ts
  $ npm install amqplib amqp-connection-manager
  ```
- We also need additional environment variables in every part of our system that wants to connect to RabbitMQ.
  ```ts
  RABBITMQ_USER=admin
  RABBITMQ_PASSWORD=admin
  RABBITMQ_HOST=localhost:5672
  RABBITMQ_QUEUE_NAME=email-subscribers

  ```
### **Creating a microservice**

Let’s start by configuring our microservice to use the above configuration.

- `main.ts`
  ```ts
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { MicroserviceOptions, Transport } from '@nestjs/microservices';
  import { ConfigService } from '@nestjs/config';
  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
  
    const user = configService.get('RABBITMQ_USER');
    const password = configService.get('RABBITMQ_PASSWORD');
    const host = configService.get('RABBITMQ_HOST');
    const queueName = configService.get('RABBITMQ_QUEUE_NAME');
  
    await app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@${host}`],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    });
  
    app.startAllMicroservices();
  }
  bootstrap();
  ```

  Queues in RabbitMQ can be durable or transient. The metadata of a durable queue is stored on the disk. If the queue is not durable, it is deleted during boot and would not survive a restart. It would delete not-consumed messages.

  According to the RabbitMQ documentation, the performance does not differ in most cases.

  After running our application, let’s visit http://localhost:15672. Here, we can see an interface that lets us interact with our RabbitMQ instance. The credentials are the same as we specified in the rabbitmq.env file.



  When we visit the Queues tab, we can see our brand new queue that was automatically created.



  The code from the previous part of this series would still work, and our controllers and services work the same.

### **Connecting to the microservice within the client**

The other side of the connection is the client. It also needs to use environmental variables and connect to RabbitMQ.

- `subscribers.module.ts`
  ```ts
  import { Module } from '@nestjs/common';
  import SubscribersController from './subscribers.controller';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { ClientProxyFactory, Transport } from '@nestjs/microservices';
  
  @Module({
    imports: [ConfigModule],
    controllers: [SubscribersController],
    providers: [
      {
        provide: 'SUBSCRIBERS_SERVICE',
        useFactory: (configService: ConfigService) => {
          const user = configService.get('RABBITMQ_USER');
          const password = configService.get('RABBITMQ_PASSWORD');
          const host = configService.get('RABBITMQ_HOST');
          const queueName = configService.get('RABBITMQ_QUEUE_NAME');
  
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${user}:${password}@${host}`],
              queue: queueName,
              queueOptions: {
                durable: true,
              },
            },
          })
        },
        inject: [ConfigService],
      }
    ],
  })
  export class SubscribersModule {}
  ```

- Thanks to doing the above, we have a function connection with our microservice.
  ```ts
  import {
    Body,
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor, Inject,
  } from '@nestjs/common';
  import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
  import CreateSubscriberDto from './dto/createSubscriber.dto';
  import { ClientProxy } from '@nestjs/microservices';
  
  @Controller('subscribers')
  @UseInterceptors(ClassSerializerInterceptor)
  export default class SubscribersController {
    constructor(
      @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
    ) {}
    
    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() subscriber: CreateSubscriberDto) {
      return this.subscribersService.send({
        cmd: 'add-subscriber'
      }, subscriber)
    }
  
    // ...
  }
  ```

### **Replying to messages**

When we start using our microservice, we notice that it can send a reply. This might make us wonder how does it happen. On the surface, we have a publisher that simply sends messages to the consumer.

If we take a look under the hood of NestJS, we can notice that it uses the amq.rabbitmq.reply-to queue. The framework sets is as a reply queue in the options passed to the amqplib library we’ve installed before. In the documentation of the Direct Reply-to feature, we can see that amq.rabbitmq.reply-to is a pseudo-queue that we can’t see in the RabbitMQ management interface.

This feature allows us to implement a request/reply pattern where a microservice can effortlessly respond.

### **Message acknowledgment**

The important thing is to ensure that a message never gets lost. Since our messages are not guaranteed to reach our consumers or be successfully processed, we need a confirmation mechanism. Fortunately, RabbitMQ supports consumer acknowledgments and publisher confirms. This topic is covered in detail in the RabbitMQ documentation.

The consumer sends back an acknowledgment, stating that it received and processed the message. If the consumer fails to consume the message fully, RabbitMQ will re-queue it.

- By default, NestJS handles acknowledgments automatically. We can do that manually, though. To do that, we need to pass the noAck: false flag when creating a microservice.
  
  ```ts
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: queueName,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  ```

- To manually acknowledge a message, we need to access the context of the currently processed message.

  ```ts

  @MessagePattern({ cmd: 'add-subscriber' })
  async addSubscriber(@Payload() subscriber: CreateSubscriberDto, @Ctx() context: RmqContext) {
    const newSubscriber = await this.subscribersService.addSubscriber(subscriber);
  
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  
    return newSubscriber;
  }
  ```

- There is more data available in the context. Let’s check out the RmqContext  type:

  ```ts 
  export declare class RmqContext extends BaseRpcContext<RmqContextArgs> {
    constructor(args: RmqContextArgs);
    /**
     * Returns the original message (with properties, fields, and content).
     */
    getMessage(): Record<string, any>;
    /**
     * Returns the reference to the original RMQ channel.
     */
    getChannelRef(): any;
    /**
     * Returns the name of the pattern.
     */
    getPattern(): string;
  }
  ```

### **Summary**

In this article, we’ve implemented a microservice using RabbitMQ. We’ve gone through all of the basics of establishing communication with RabbitMQ and discussed the advantages of such an approach. We’ve also gone a little deeper and looked into the internals of NestJS to understand how it uses RabbitMQ under the hood a little better. This definitely gave us quite a bit of an overview of why we might want to use RabbitMQ and how.

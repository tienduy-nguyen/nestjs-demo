# Microservice with Nestjs

Check original article at [Marcin Wanago Nestjs Microservice](https://wanago.io/2020/11/16/api-nestjs-microservices/)
## The overview of microservices
  
- By implementing the microservice architecture, we break down our API into smaller, independent components. Having a separate codebase, and implementing a microservice separately, can make our application more scalable. Because we implement and deploy each microservice separately, it might be easier to handle feature releases and bug fixes.

- Also, embracing microservices can be a good approach when choosing the right tool for the job. Your company can manage some microservices in Java and some in Node.js, for example.

- Building our application with microservices also offers more flexibility in terms of deployment and managing resources between services. It might also be easier to manage database schema migration if we have multiple smaller databases instead of a monolithic one.

- All of the above benefits come with some drawbacks, too. Even though each microservice is simpler than a monolithic application, managing multiple smaller apps is challenging. When updating a microservice, we need to make sure that we won’t break other services that depend on it.

- We also need to adjust to microservices when developing. Communicating between services is not free and introduces a bit of latency. It can stack up as the number of dependencies between microservices grows. Also, testing microservices might prove not to be easy.


## Implementing microservices with NestJS

Fortunately, NestJS has a set of tools prepared to make working with microservices easier. In this article, we craft a simple microservice for managing email subscriptions. Using the knowledge from this series, we create a way to store a list of email subscribers.

- First, we create a brand new repository for our microservice. To start things up, we use NestJS CLI.
  ```bash
  $ npm install -g @nestjs/cli
  $ nest new email-subscriptions  
  ```
- For starters, we connect to a Postgres database with Docker in the same way as in the second part of this series.

  To avoid conflicts between databases of our main app and our microservice, you might choose a different set of ports in our docker-compose this time

- First, let’s create an entity so that we can store our subscribers.

  ```ts
  import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
  
  @Entity()
  export class Subscriber {
    @PrimaryGeneratedColumn()
    public id: number;
  
    @Column({ unique: true })
    public email: string;
  
    @Column()
    public name: string;
  }
  
  ```
- Now, we can create a very straightforward service to add and list email subscribers.
  ```ts
  import { Injectable } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import Subscriber from './subscriber.entity';
  import CreateSubscriberDto from './dto/createSubscriber.dto';
  import { Repository } from 'typeorm';
  
  @Injectable()
  export class SubscribersService {
    constructor(
      @InjectRepository(Subscriber)
      private subscribersRepository: Repository<Subscriber>,
    ) {}
  
    async addSubscriber(subscriber: CreateSubscriberDto) {
      const newSubscriber = await this.subscribersRepository.create(subscriber);
      await this.subscribersRepository.save(newSubscriber);
      return newSubscriber;
    }
  
    async getAllSubscribers() {
      return this.subscribersRepository.find();
    }
  }
  ```

  Once we have the core logic ready, we can start thinking about how we expose our microservice. For that, we can create a controller.


## **Using the TCP layer**

<details>
<summary>
Click to expand
</summary>


This time, it is not a regular controller, though. Although we could create the API with HTTP, NestJS suggests a different approach. Instead of using HTTP, NestJS has its own abstraction over the TCP transport layer for microservices.

There are many suggested ways to connect to our NestJS microservices such as gRPC, but those are a topic for separate articles.

When bootstrapping multiple NestJS applications into microservice architecture, NestJS establishes the connection before the first call for a particular microservice. It later reuses it across each subsequent call, which couldn’t always be achieved with HTTP.

Also, using TCP differently allows us to achieve event-based communication if we want. This way, the client does not wait for the response from the microservice.

- The first approach suggested by NestJS is the request-response message style. It is suitable when we want to exchange messages between services. To create a message based handle, we need the @MessagePattern() decorator.

  ```ts
  import { Controller } from '@nestjs/common';
  import { MessagePattern } from '@nestjs/microservices';
  import CreateSubscriberDto from './dto/createSubscriber.dto';
  import { SubscribersService } from './subscribers.service';
  
  @Controller('subscribers')
  export class SubscribersController {
    constructor(
      private readonly subscribersService: SubscribersService,
    ) {}
  
    @MessagePattern({ cmd: 'add-subscriber' })
    addSubscriber(subscriber: CreateSubscriberDto) {
      return this.subscribersService.addSubscriber(subscriber);
    }
  
    @MessagePattern({ cmd: 'get-all-subscribers' })
    getAllSubscribers() {
      return this.subscribersService.getAllSubscribers();
    }
  }
  ```

  Above, our handlers listen for messages that match the provided pattern. A pattern is a plain value that can be an object or a string, for example. NestJS sends them along with the data:

  - `if { cmd: 'add-subscriber' }) is the pattern, the addSubscriber method is called`
  - `if { cmd: 'get-all-subscribers' } is the pattern, the getAllSubscribers method is called`

- We also need to create a simple SubscribersModule, so that we can add it to our AppModule.

  ```ts

  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import Subscriber from './subscriber.entity';
  import { SubscribersService } from './subscribers.service';
  import { SubscribersController } from './subscribers.controller';
  
  @Module({
    imports: [TypeOrmModule.forFeature([Subscriber])],
    providers: [SubscribersService],
    exports: [],
    controllers: [SubscribersController],
  })
  export class SubscribersModule {}
  The last thing to do is to expose our microservice. To do that, let’s modify the default bootstrap function in the main.ts file of our service.

  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { MicroserviceOptions, Transport } from '@nestjs/microservices';
  import { ConfigService } from '@nestjs/config';
  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
  
    await app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: {
        port: configService.get('PORT'),
      },
    });
  
    app.startAllMicroservices();
  }
  bootstrap();

  ```
  Above we use an instance of the ConfigService. If you want to know how to deal with environment variables with NestJS, check out the second part of this series.

### **Adding a microservice to an existing monolith app**

There might be a case in which we didn’t design our application with microservices in mind from the beginning. In this case, we would want to connect our monolithic app to a new microservice.

- To do that, let’s create a SubscribersModule inside of our monolithic NestJS application.

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
        useFactory: (configService: ConfigService) => (
          ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
              host: configService.get('SUBSCRIBERS_SERVICE_HOST'),
              port: configService.get('SUBSCRIBERS_SERVICE_PORT'),
            }
          })
        ),
        inject: [ConfigService],
      }
    ],
  })
  export class SubscribersModule {}
  ```
  Above, we expect SUBSCRIBERS_SERVICE_HOST and SUBSCRIBERS_SERVICE_PORT to be provided in the `.env `file.

- We also need a SubscribersController that communicates with our microservice.

  ```ts
  import {
    Body,
    Controller,
    Get,
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
  
    @Get()
    @UseGuards(JwtAuthenticationGuard)
    async getSubscribers() {
      return this.subscribersService.send({
        cmd: 'get-all-subscribers'
      }, '')
    }
  
    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() subscriber: CreateSubscriberDto) {
      return this.subscribersService.send({
        cmd: 'add-subscriber'
      }, subscriber)
    }
  }

  ```
  We could also create a dedicated microservice instead of using the ClientProxy directly in the controller. This would give us the possibility to export it from the SubscribersModule and use in other places of our application.

  Please note that even though we don’t need to send any data to get a list of subscribers, NestJS throws an error if we use null or undefined in subscribersService.send. Because of that, we pass an empty string here.

- Above, we’ve created the following flow:

  - the user calls the  /subscribers endpoint in our monolithic app,
  - our application calls the microservice to get the necessary data,
  - the microservice retrieves the data from its own database,
  - our main application responds with the data.
  
In our SubscribersController, only logged-in users can list and create subscribers. Although that’s the case, we didn’t implement any authentication mechanism inside of our microservice that deals with subscribers. This is because we intend it to be a private API. We don’t want to expose it to the world, and we want only our main application to be able to communicate with it. Such a firewall should be configured at the architecture level. We will cover this topic more when creating an API Gateway for an architecture designed with microservices in mind.



### **Using the event-based communication**

Aside from using the @MessagePattern(), we can also implement event-based communication. This is fitting for cases in which we don’t want to wait for a response. We can do so in the case of creating new subscribers.

- For starters, we want our microservice to listen for events instead of messages.

  ```ts
  import { Controller } from '@nestjs/common';
  import { EventPattern } from '@nestjs/microservices';
  import CreateSubscriberDto from './dto/createSubscriber.dto';
  import { SubscribersService } from './subscribers.service';
  
  @Controller()
  export class SubscribersController {
    constructor(
      private readonly subscribersService: SubscribersService,
    ) {}
  
    @EventPattern({ cmd: 'add-subscriber' })
    addSubscriber(subscriber: CreateSubscriberDto) {
      return this.subscribersService.addSubscriber(subscriber);
    }
  
    // ...
  }
  ```


- Then, we need to emit the event from our monolithic app.

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
      return this.subscribersService.emit({
        cmd: 'add-subscriber'
      }, subscriber)
    }
  
    // ...
  }
  ```

  Even if this could be more performant, implementing the above might not be what we want in our case, though. Since we are not waiting for the response, we wouldn’t know if adding the subscriber succeeded. Even if it did, we wouldn’t receive details such as the id.

### **Summary**

In this article, we’ve introduced the idea of microservices. This included creating a simple microservice and connecting it to an existing monolithic application. While this is a common use-case, we could also design architecture with microservices in mind from the beginning. This would include, for example, creating a dedicated API Gateway. We will cover that and other ways of communicating between services in the upcoming articles.


</details>

---

## **Using RabbitMQ to communicate with microservices**

<details>
<summary>
Click here to expand
</summary>

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

</details>
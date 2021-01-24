# Microservice with Nestjs

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


## Using the TCP layer

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

## Adding a microservice to an existing monolith app

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



## Using the event-based communication

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

## Summary

In this article, we’ve introduced the idea of microservices. This included creating a simple microservice and connecting it to an existing monolithic application. While this is a common use-case, we could also design architecture with microservices in mind from the beginning. This would include, for example, creating a dedicated API Gateway. We will cover that and other ways of communicating between services in the upcoming articles.
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { graphqlOptions } from '../common/graphql/graphql-options';

@Module({
  imports: [GraphQLModule.forRoot(graphqlOptions())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

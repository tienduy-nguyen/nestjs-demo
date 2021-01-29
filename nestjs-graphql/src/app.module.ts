import { ormConfig } from '@common/config/ormConfig';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: join(
        process.cwd(),
        'src/common/schema-graphql/schema.gql',
      ),
      sortSchema: true,
    }),
    TypeOrmModule.forRoot(ormConfig()),
  ],
})
export class AppModule {}

import { ormConfig } from '@common/config/ormConfig';
import { CustomerModule } from '@modules/customer/customer.module';
import { InvoiceModule } from '@modules/invoice/invoice.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
    CustomerModule,
    InvoiceModule,
  ],
})
export class AppModule {}

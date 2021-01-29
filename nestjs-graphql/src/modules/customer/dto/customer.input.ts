import { IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CustomerInput {
  @IsString()
  @Field()
  name: string;

  @IsString()
  @Field()
  email: string;

  @IsString()
  @Field()
  phone: string;

  @IsString()
  @Field()
  address: string;
}

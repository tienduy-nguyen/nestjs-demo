import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ItemInput {
  @Field()
  description: string;

  @Field()
  rate: number;

  @Field()
  quantity: number;
}

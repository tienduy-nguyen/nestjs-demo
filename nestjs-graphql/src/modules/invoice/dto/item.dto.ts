import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ItemDTO {
  @Field()
  description: string;

  @Field()
  rate: number;

  @Field()
  quantity: number;
}

import { PaymentStatus, Currency, IItem } from '../invoice.types';
import { InputType, Field } from '@nestjs/graphql';
import { ItemInput } from './item.input';

@InputType()
export class InvoiceInput {
  @Field()
  customer: string;
  @Field()
  invoiceNo: string;
  @Field()
  paymentStatus: PaymentStatus;
  @Field()
  description: string;
  @Field()
  currency: Currency;
  @Field()
  taxRate: number;
  @Field()
  issueDate: Date;
  @Field()
  dueDate: Date;
  @Field()
  note: string;
  @Field(() => [ItemInput])
  items: Array<IItem>;
}

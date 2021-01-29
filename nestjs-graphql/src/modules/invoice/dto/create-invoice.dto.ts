import { PaymentStatus, Currency, IItem } from '../invoice.types';
import { InputType, Field } from '@nestjs/graphql';
import { ItemDTO } from './item.dto';

@InputType()
export class CreateInvoiceDTO {
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
  @Field(() => [ItemDTO])
  items: Array<IItem>;
}

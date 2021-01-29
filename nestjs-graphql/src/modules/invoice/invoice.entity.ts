import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { Customer } from '@modules/customer/customer.entity';
import { Currency, PaymentStatus } from './invoice.types';

@ObjectType()
export class Item {
  @Field()
  description: string;

  @Field()
  rate: number;

  @Field()
  quantity: number;
}

@ObjectType()
@Entity()
export class Invoice {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field()
  @Column({ length: 500, nullable: false })
  public invoiceNo: string;

  @Field()
  @Column('text')
  public description: string;

  @Field(() => Customer)
  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer: Customer;

  @Field()
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.NOT_PAID,
  })
  public paymentStatus: PaymentStatus;

  @Field()
  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
  })
  public currency: Currency;

  @Field()
  @Column()
  @CreateDateColumn()
  issueDate: Date;

  @Field()
  @Column('text')
  public note: string;

  @Field(() => [Item])
  @Column({
    type: 'jsonb',
    array: false,
    default: [],
    nullable: false,
  })
  items: Item[];

  @Field()
  @Column()
  taxAmount: number;

  @Field()
  @Column()
  public subTotal: number;

  @Column()
  @Field()
  total: number;

  @Column({
    default: 0,
  })
  @Field()
  amountPaid: number;

  @Column()
  @Field()
  outstandingBalance: number;

  @Field()
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}

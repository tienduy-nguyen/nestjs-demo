import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Invoice } from '@modules/invoice/invoice.entity';

@ObjectType()
@Entity()
export class Customer {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Field()
  @Column({ length: 500, nullable: false })
  public name: string;

  @Field()
  @Column('text', { nullable: false })
  public email: string;

  @Field()
  @Column()
  public phone: string;

  @Field()
  @Column('text')
  public address: string;

  @Field(() => [Invoice], { nullable: true })
  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  public invoices: Invoice[];

  @Field()
  @Column()
  @CreateDateColumn()
  public created_at: Date;

  @Field()
  @Column()
  @CreateDateColumn()
  updated_at: Date;
}

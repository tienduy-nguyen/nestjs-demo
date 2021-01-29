import { Invoice } from '@modules/invoice/invoice.entity';
import { InvoiceService } from '@modules/invoice/invoice.service';
import {
  Args,
  Resolver,
  Query,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { Customer } from './customer.entity';
import { CustomerService } from './customer.service';
import { CustomerInput } from './dto/customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
  ) {}

  @Query(() => String)
  public async hello() {
    return 'hello';
  }

  @Query(() => Customer)
  public async getCustomer(@Args('id') id: string): Promise<Customer> {
    return await this.customerService.getCustomerById(id);
  }

  @Query(() => [Customer])
  public async getCustomers() {
    return await this.customerService.getCustomers();
  }

  @ResolveField('posts', () => [Invoice])
  async getPosts(@Parent() customer: Customer) {
    return this.invoiceService.getInvoiceByCustomerId(customer.id);
  }

  @Mutation(() => Customer)
  public async createCustomer(
    @Args('customerInput') customerInput: CustomerInput,
  ) {
    return await this.customerService.createCustomer(customerInput);
  }
}

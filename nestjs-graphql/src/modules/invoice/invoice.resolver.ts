import { Customer } from '@modules/customer/customer.entity';
import { CustomerService } from '@modules/customer/customer.service';
import {
  Args,
  Resolver,
  Query,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { InvoiceInput } from './dto/invoice.input';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';

@Resolver(() => Invoice)
export class InvoiceResolver {
  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
  ) {}

  @Query(() => Invoice)
  public async getInvoice(@Args('id') id: string) {
    return await this.invoiceService.getInvoiceById(id);
  }

  @Query(() => [Invoice])
  public async getInvoices() {
    return await this.invoiceService.getInvoices();
  }

  @ResolveField(() => Customer)
  public async invoiceToCustomer(@Parent() invoice) {
    return await this.customerService.getCustomerById(invoice.customer?.id);
  }

  @Mutation(() => Invoice)
  public async createInvoice(@Args('invoiceInput') invoiceInput: InvoiceInput) {
    return await this.invoiceService.createInvoice(invoiceInput);
  }
}

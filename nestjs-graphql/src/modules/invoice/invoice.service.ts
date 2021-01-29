import { CustomerService } from '@modules/customer/customer.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceInput } from './dto/invoice.input';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    private customerService: CustomerService,
  ) {}

  public async getInvoices() {
    return await this.invoiceRepo.find();
  }

  public async getInvoiceByCustomerId(customerId: string) {
    return await this.invoiceRepo.find({ where: { customerId: customerId } });

    // Or using query builder
    // return await this.invoiceRepo
    //   .createQueryBuilder('invoice')
    //   .where('invoice.customer = :id', { customerId })
    //   .getMany();
  }

  public async getInvoiceById(id: string) {
    return await this.invoiceRepo.findOne(id);
  }

  public async createInvoice(invoiceDto: InvoiceInput) {
    try {
      const customer = await this.customerService.getCustomerById(
        invoiceDto.customer,
      );
      const subTotal = invoiceDto.items.reduce((sum, current): number => {
        return sum + Number((current.rate * current.quantity).toFixed(2));
      }, 0);
      const taxAmount =
        subTotal * Number((invoiceDto.taxRate / 100).toFixed(2));
      const total = subTotal + taxAmount;
      const outstandingBalance = total;

      const newInvoice = this.invoiceRepo.create({
        ...invoiceDto,
        customer,
        subTotal,
        taxAmount,
        total,
        outstandingBalance,
      } as any);

      await this.invoiceRepo.save(newInvoice);
      return newInvoice;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

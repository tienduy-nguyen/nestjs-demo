import { CustomerService } from '@modules/customer/customer.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
    private customerService: CustomerService,
  ) {}

  public async findInvoices() {
    return await this.invoiceRepo.find();
  }

  public async findByCustomerId(customerId: string) {
    return await this.invoiceRepo.find({ where: { customerId: customerId } });

    // Or using query builder
    // return await this.invoiceRepo
    //   .createQueryBuilder('invoice')
    //   .where('invoice.customer = :id', { customerId })
    //   .getMany();
  }

  public async findById(id: string) {
    return await this.invoiceRepo.findOne(id);
  }
}

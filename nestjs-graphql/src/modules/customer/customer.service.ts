import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerInput } from './dto/customer.input';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  public async createCustomer(customerInput: CustomerInput): Promise<Customer> {
    const newCustomer = this.customerRepo.create(customerInput);
    await this.customerRepo.save(newCustomer);
    return newCustomer;
  }

  public async getCustomers(): Promise<Customer[]> {
    return await this.customerRepo.find();
  }

  public async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }
}

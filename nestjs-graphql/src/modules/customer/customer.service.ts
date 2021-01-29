import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDTO } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
  ) {}

  public async create(customerDto: CreateCustomerDTO): Promise<Customer> {
    const newCustomer = this.customerRepo.create(customerDto);
    await this.customerRepo.save(newCustomer);
    return newCustomer;
  }

  public async findCustomers(): Promise<Customer[]> {
    return await this.customerRepo.find();
  }

  public async findById(id: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }
}

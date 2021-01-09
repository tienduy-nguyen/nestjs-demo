import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { Product } from '../product.entity';
import { IProductService } from './product.service.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  create(productDto: CreateProductDto): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  update(productId: any, updateProduct: any): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  search(q: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

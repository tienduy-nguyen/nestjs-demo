import { BaseRepository } from 'src/shared/base-repository/base.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IProductRepository } from './product.repository.interface';
import { Product } from '../product.entity';

@Injectable()
export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository);
  }
}

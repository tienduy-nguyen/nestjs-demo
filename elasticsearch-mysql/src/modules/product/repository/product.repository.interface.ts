import { IBaseRepository } from 'src/shared/base-repository/base.repository.interface';
import { DeleteResult } from 'typeorm';
import { Product } from '../product.entity';

export interface IProductRepository extends IBaseRepository<Product> {
  create(data: Product | any): Promise<Product>;

  findOneById(id: number): Promise<Product>;

  findByCondition(filterCondition: any): Promise<Product>;

  findAll(): Promise<Product[]>;

  remove(id: string): Promise<DeleteResult>;

  findWithRelations(relations: any): Promise<Product[]>;
}

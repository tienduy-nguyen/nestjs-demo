import { CreateProductDto } from '../dto';
import { Product } from '../product.entity';

export interface IProductService {
  create(productDto: CreateProductDto): Promise<Product>;

  update(productId: any, updateProduct: any): Promise<Product>;

  search(q: any): Promise<any>;
}

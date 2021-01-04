import { Repository, EntityRepository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  public async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const { name, description, price } = createProductDto;

    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;

    await product.save();
    return product;
  }

  public async updateProduct(
    updateProductDto: UpdateProductDto,
    product: Product,
  ): Promise<Product> {
    const { name, description, price } = updateProductDto;
    product.name = name;
    product.description = description;
    product.price = price;

    await product.save();
    return product;
  }
}

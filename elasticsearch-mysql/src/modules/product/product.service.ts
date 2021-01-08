import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  public async getProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  public async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: Number(id) },
    });
    if (!product) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
    return product;
  }

  public async createProduct(productDto: CreateProductDto) {
    const product = Object.assign({}, productDto);
    return await this.productRepository.create(product);
  }

  public async updateProduct(id: string, productDto: UpdateProductDto) {
    let check = await this.productRepository.findOne(id);
    if (!check) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
    check = Object.assign(check, productDto);
    await this.productRepository.save(check);
    return check;
  }

  public async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private _productRepository: ProductRepository,
  ) {}

  public async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    return await this._productRepository.createProduct(createProductDto);
  }

  public async getProducts(): Promise<Product[]> {
    const result = await this._productRepository.find();
    return result;
  }

  public async getProductById(id: number): Promise<Product> {
    const product = await this._productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  public async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this._productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this._productRepository.updateProduct(updateProductDto, product);
  }

  public async deleteProduct(id: number): Promise<void> {
    await this._productRepository.delete(id);
  }
}

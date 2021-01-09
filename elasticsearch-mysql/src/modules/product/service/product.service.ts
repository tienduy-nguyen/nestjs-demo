import { Inject, Injectable } from '@nestjs/common';
import { ISearchService } from 'src/modules/search/service/search.service.interface';
import { CreateProductDto } from '../dto';
import { Product } from '../product.entity';
import { ProductSearchObject } from '../product.search.object';
import { IProductRepository } from '../repository/product.repository.interface';
import { IProductService } from './product.service.interface';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('ISearchService')
    private readonly searchService: ISearchService<any>,
  ) {}
  public async create(productDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = productDto.name;
    product.description = productDto.description;
    product.price = productDto.price;
    return this.productRepository.create(product);
  }

  public async update(productId: any, updateProduct: any): Promise<Product> {
    const product = await this.productRepository.findOneById(productId);
    product.name = updateProduct.name;
    product.description = updateProduct.description;
    product.price = updateProduct.price;
    return this.productRepository.create(product);
  }

  public async search(q: any): Promise<any> {
    const data = ProductSearchObject.searchObject(q);
    return this.searchService.searchIndex(data);
  }
}

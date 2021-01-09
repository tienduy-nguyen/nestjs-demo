import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from '../search/service/search.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductRepository } from './repository/product.repository';
import { ProductService } from './service/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepository,
    },
    {
      provide: 'IProductService',
      useClass: ProductService,
    },
    {
      provide: 'ISearchService',
      useClass: SearchService,
    },
  ],
  controllers: [ProductController],
})
export class ProductModule {}

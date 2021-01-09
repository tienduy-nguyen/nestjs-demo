import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/modules/product/product.entity';
import { SearchService } from 'src/modules/search/search.service';
import { ProductElasticIndex } from 'src/modules/search/search-index/product.elastic.index';
import { ISearchService } from 'src/modules/search/ISearchService';
import { ProductSubscriber } from './subscribers/product.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [
    {
      provide: 'ISearchService',
      useClass: SearchService,
    },
    ProductElasticIndex,
    ProductSubscriber,
  ],
})
export class ObserverModule {}

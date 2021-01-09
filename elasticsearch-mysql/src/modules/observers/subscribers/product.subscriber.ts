import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Product } from 'src/modules/product/product.entity';
import { ProductElasticIndex } from 'src/modules/search/search-index/product.elastic.index';
import { InjectConnection } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  constructor(
    @InjectConnection() readonly connection: Connection,
    private readonly productEsIndex: ProductElasticIndex,
  ) {
    connection.subscribers.push(this);
  }

  public listenTo(): any {
    return Product;
  }

  public async afterInsert(event: InsertEvent<Product>): Promise<any> {
    return this.productEsIndex.insertProductDocument(event.entity);
  }

  public async afterUpdate(event: UpdateEvent<Product>): Promise<any> {
    return this.productEsIndex.updateProductDocument(event.entity);
  }
}

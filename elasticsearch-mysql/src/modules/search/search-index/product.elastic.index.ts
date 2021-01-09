import { Inject, Injectable } from '@nestjs/common';
import { ISearchService } from '../service/search.service.interface';
import { productIndex } from '../constants';
import { Product } from 'src/modules/product/product.entity';

@Injectable()
export class ProductElasticIndex {
  constructor(
    @Inject('ISearchService')
    private readonly searchService: ISearchService<any>,
  ) {}

  public async insertProductDocument(product: Product): Promise<any> {
    const data = this._productDocument(product);
    return this.searchService.insertIndex(data);
  }

  public async updateProductDocument(product: Product): Promise<any> {
    const data = this._productDocument(product);
    await this._deleteProductDocument(product.id);
    return this.searchService.insertIndex(data);
  }

  /* Private helper methods */
  private async _deleteProductDocument(prodId: number): Promise<any> {
    const data = {
      index: productIndex._index,
      type: productIndex._type,
      id: prodId.toString(),
    };
    return this.searchService.deleteDocument(data);
  }

  private _bulkIndex(productId: number): any {
    return {
      _index: productIndex._index,
      _type: productIndex._type,
      _id: productId,
    };
  }
  private _productDocument(product: Product): any {
    const bulk = [];
    bulk.push({
      index: this._bulkIndex(product.id),
    });
    bulk.push(product);
    return {
      body: bulk,
      index: productIndex._index,
      type: productIndex._type,
    };
  }
}

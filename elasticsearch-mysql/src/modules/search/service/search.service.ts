import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ISearchService } from './search.service.interface';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchConfig } from '../search.config';

@Injectable()
export class SearchService
  extends ElasticsearchService
  implements ISearchService<any> {
  constructor() {
    super(SearchConfig.configSetup(process.env.ELASTIC_SEARCH_URL));
  }
  public async insertIndex(bulkData: any): Promise<any> {
    try {
      return await this.bulk(bulkData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  public async updateIndex(updateData: any): Promise<any> {
    try {
      return await this.update(updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  public async searchIndex(searchData: any): Promise<any> {
    try {
      const res = await this.search(searchData);
      return res.body?.hits?.hits;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  public async deleteIndex(indexData: any): Promise<any> {
    try {
      return await this.delete(indexData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  public async deleteDocument(indexData: any): Promise<any> {
    try {
      return await this.delete(indexData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

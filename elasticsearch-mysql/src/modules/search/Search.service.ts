import { Injectable } from '@nestjs/common';
import { ISearchService } from './ISearchService';

@Injectable()
export class SearchService implements ISearchService<any> {
  insertIndex(bulkData: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  updateIndex(updateData: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  searchIndex(searchData: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deleteIndex(indexData: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deleteDocument(indexData: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

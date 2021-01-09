import { Module } from '@nestjs/common';
import { SearchService } from './service/search.service';

@Module({
  providers: [{ provide: 'ISearchService', useClass: SearchService }],
  exports: [SearchModule],
})
export class SearchModule {}

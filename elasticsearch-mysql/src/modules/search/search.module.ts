import { Module } from '@nestjs/common';
import { SearchService } from './search.service';

@Module({
  providers: [{ provide: 'ISearchService', useClass: SearchService }],
  exports: [SearchModule],
})
export class SearchModule {}

import { Module } from '@nestjs/common';
import { SearchService } from './Search.service';

@Module({
  providers: [{ provide: 'ISearchService', useClass: SearchService }],
  exports: [SearchModule],
})
export class SearchModule {}

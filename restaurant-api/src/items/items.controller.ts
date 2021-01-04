import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly _itemService: ItemsService) {}

  @Get()
  async findAll(): Promise<string[]> {
    return this._itemService.findAll();
  }

  @Post()
  async create(@Body() item: string) {
    this._itemService.create(item);
  }
}

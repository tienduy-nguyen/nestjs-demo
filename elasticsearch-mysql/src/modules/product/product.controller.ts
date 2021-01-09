import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto';
import { Product } from './product.entity';
import { IProductService } from './service/product.service.interface';

@ApiTags('products')
@Controller('api/products')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService,
  ) {}

  @Post()
  public async create(@Body() productDto: CreateProductDto): Promise<Product> {
    return this.productService.create(productDto);
  }

  @Put('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateProduct: any,
  ): Promise<Product> {
    return this.productService.update(id, updateProduct);
  }

  @Get('/search')
  public async search(@Query() query: any): Promise<any> {
    return this.productService.search(query.q);
  }
}

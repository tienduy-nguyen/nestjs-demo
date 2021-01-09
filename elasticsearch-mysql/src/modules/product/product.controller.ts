import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto';
import { Product } from './product.entity';
import { ProductService } from './service/product.service';

@ApiTags('products')
@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

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

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  public async getProducts(): Promise<Product[]> {
    return await this.productService.getProducts();
  }

  @Get('/:id')
  public async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }
  @Post()
  public async createProduct(@Body() productDto: CreateProductDto) {
    return await this.productService.createProduct(productDto);
  }

  @Put('/:id')
  public async updateProduct(
    @Param('id') id: string,
    @Body() productDto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, productDto);
  }

  @Delete('/:id')
  public async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }
}

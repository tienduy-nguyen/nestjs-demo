import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('api/products')
export class ProductController {
  constructor(private _productService: ProductService) {}

  @ApiOperation({ summary: 'Create new product' })
  @Post()
  public async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = await this._productService.createProduct(createProductDto);
    return product;
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  public async getProducts(): Promise<Product[]> {
    const products = await this._productService.getProducts();
    return products;
  }

  @ApiOperation({ summary: 'Get product detail by Id' })
  @Get('/:id')
  public async getProductById(@Param('id') id: number) {
    const product = await this._productService.getProductById(id);
    return product;
  }

  @ApiOperation({ summary: 'Update product' })
  @Put('/:id')
  public async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this._productService.updateProduct(
      id,
      updateProductDto,
    );
    return product;
  }

  @ApiOperation({ summary: 'Update partial product' })
  @Patch('/:id')
  public async updateProductPartial(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this._productService.updateProduct(
      id,
      updateProductDto,
    );
    return product;
  }

  @ApiOperation({ summary: 'Delete product' })
  @Delete('/:id')
  public async deleteProduct(@Param('id') id: number): Promise<void> {
    await this._productService.deleteProduct(id);
  }
}

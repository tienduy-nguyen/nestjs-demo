import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    getProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product>;
    createProduct(productDto: CreateProductDto): Promise<Product>;
    updateProduct(id: string, productDto: UpdateProductDto): Promise<Product>;
    deleteProduct(id: string): Promise<void>;
}

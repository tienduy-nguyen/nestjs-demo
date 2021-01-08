import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './product.entity';
export declare class ProductService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    getProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product>;
    createProduct(productDto: CreateProductDto): Promise<Product>;
    updateProduct(id: string, productDto: UpdateProductDto): Promise<Product>;
    deleteProduct(id: string): Promise<void>;
}

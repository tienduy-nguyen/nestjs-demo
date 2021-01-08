import { BaseEntity } from 'typeorm';
export declare class Product extends BaseEntity {
    id: number;
    name: string;
    price: string;
    createdAt: Date;
    updatedAt: Date;
}

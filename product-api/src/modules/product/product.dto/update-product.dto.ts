import { IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  price: string;
}

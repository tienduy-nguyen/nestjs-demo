import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  price: string;
}

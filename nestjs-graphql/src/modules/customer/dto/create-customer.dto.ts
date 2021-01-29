import { IsString } from 'class-validator';

export class CreateCustomerDTO {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;
}

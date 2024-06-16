import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class createDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  colors: string;
  description: string;
  inAvailability: string;
  category: string;
  subcategory: string;
  weight: string;
  height: string;
  token: string;
  @IsNumber()
  price: number;
}
export class changeDto extends createDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
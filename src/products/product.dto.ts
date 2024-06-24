import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
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

  turningMethod: string;
  width:string;
  long:string;
  @IsNumber()
  price: number;
  discount:number;
  @ApiProperty({ type: [String] })
  deliveryMethod: string[]; 
   paymentMethod: string[];
}
export class changeDto extends createDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsNumber()
  article: number;
  oldImg: string;
}
export class createCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  token:string
}
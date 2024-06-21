import { Type } from 'class-transformer';
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
  deliveryMethod: string;
  paymentMethod: string;
  turningMethod: string;
  
  @IsNumber()
  price: number;
  discounts:number;
 
}
export class changeDto extends createDto {
  @IsString()
  @IsNotEmpty()
  id: string;
 

  @IsNumber()
  article: number;

 
  oldImgArr: string;
  
}
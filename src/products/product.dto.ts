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
 
  paymentMethod: string;
  turningMethod: string;
  width:string;
  long:string;
    @IsNumber()
  price: number;
  discount:number;
  @ApiProperty({ type: [String] })
  deliveryMethod: string[];
  
}
export class changeDto extends createDto {
  @IsString()
  @IsNotEmpty()
  id: string;
 

  @IsNumber()
  article: number;

 
   oldImg: string;
  
}
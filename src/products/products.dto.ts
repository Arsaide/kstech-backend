import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
export class createDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  inAvailability: string;
  @IsString()
  @IsNotEmpty()
  category: string;
  subcategory: string;
  weight: string;
  height: string;
  token: string;
  country: string;
  width: string;
  long: string;
  @IsNumber()
  price: number;
  discount: number;
  @ApiProperty({ type: [String] })
  deliveryMethod: string[];
  paymentMethod: string[];
  colors: string[];
  turningMethod: string[];
}
export class changeDto extends createDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  @IsNumber()
  oldImg?: string;
}
export class createCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  token: string;
}
export class addSubcategory {
  @IsString()
  @IsNotEmpty()
  id: string;
  subcategory: string;
}
export class getForCategoryDto {
  page: string;
  category: string;
}
export class getForSubcategoryDto {
  page: string;
  subcategory: string;
}
class ProductDto {
  @IsString()
  id: string;

  deliveryMethod: string;
}

class ClientDto {
  @IsNumber()
  order: number;

  @IsString()
  clientName: string;

  @IsString()
  surname: string;

  @IsString()
  number: string;

  @IsString()
  email: string;

  @IsBoolean()
  feedback: boolean;

  @IsString()
  country: string;

  @IsString()
  town: string;

  @IsString()
  street: string;

  @IsString()
  office: string;

  @IsString()
  comment: string;
}

export class BuyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @ValidateNested()
  @Type(() => ClientDto)
  client: ClientDto;
}

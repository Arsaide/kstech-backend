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
  @IsNumber()
  price: number;
}

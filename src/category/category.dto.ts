import { IsNotEmpty, IsString } from "class-validator";

export class createCategoryDto {
	@IsString()
	@IsNotEmpty()
	name: string;
	token:string
}
export class addSubcategory   {
	@IsString()
	@IsNotEmpty()
	id: string;
	subcategory:string;
}
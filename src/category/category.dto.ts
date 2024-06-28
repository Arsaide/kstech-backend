import { IsNotEmpty, IsString } from "class-validator";

export class createCategoryDto {
	@IsString()
	@IsNotEmpty()
	category: string;
	token:string
}
export class addSubcategory   {
	@IsString()
	@IsNotEmpty()
	id: string;
	subcategory:string;
}
export class changeCategoryDto extends createCategoryDto{
	@IsString()
	@IsNotEmpty()
	id: string;
}
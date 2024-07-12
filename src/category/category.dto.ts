import { IsNotEmpty, IsString } from "class-validator";

export class createCategoryDto {
	@IsString()
	@IsNotEmpty()
	category: string;
	token:string
}
export class addSubcategory   {
	@IsString()
	@IsNotEmpty()т
	token: string;
	id: string;
	subcategory:string;
}
export class changeCategoryDto {
	@IsString()
	@IsNotEmpty()
    newName?: string;
	token:string
	id: string;
}
export class changeSubcategoryDto  {
	@IsString()
	@IsNotEmpty()
	newName?: string;
	token:string
	id:string;
	
	
}
export class deleteCategoryDto{
	@IsString()
	@IsNotEmpty()
	id: string;
	token:string
}
export class deleteSubcategoryDto{
	@IsString()
	@IsNotEmpty()
	id:string;
	token:string
}
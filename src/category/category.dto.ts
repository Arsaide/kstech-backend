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
export class changeCategoryDto {
	@IsString()
	@IsNotEmpty()
 newName: string;
	token:string
	id: string;
}
export class changeSubcategoryDto  {
	@IsString()
	@IsNotEmpty()
	newName: string;
	token:string
	id: string;
	oldName:string

}
export class deleteCategoryDto{
	@IsString()
	@IsNotEmpty()
	category: string;
	token:string
}
export class deleteSubcategoryDto{
	@IsString()
	@IsNotEmpty()
	category: string;
	subcategory:string;
	token:string
}
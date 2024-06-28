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
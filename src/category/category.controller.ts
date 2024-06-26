import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { addSubcategory, createCategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post("addsubcategory")
	@UsePipes(new ValidationPipe())
	addsubcategory(@Body() dto: addSubcategory) {
		return this.categoryService.addSubcategory(dto)
	}
  @Post("createcategory")
	@UsePipes(new ValidationPipe())
	createcategory(@Body() dto: createCategoryDto) {
		return this.categoryService.createCategory(dto)
	}
  @Get("getcategory")
	@UsePipes(new ValidationPipe())
	getcategory() {
		return this.categoryService.getCategory()
	}
  @Get("getonecategory")
	@UsePipes(new ValidationPipe())
	getonecategory(@Query("id") id: string) {
		return this.categoryService.getOneCategory(id)
	}
}

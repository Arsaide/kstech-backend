import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoryService } from './category.service';
import { addSubcategory, changeCategoryDto, changeSubcategoryDto, createCategoryDto, deleteCategoryDto, deleteSubcategoryDto } from './category.dto';
import * as Multer from "multer"
import { FilesInterceptor } from '@nestjs/platform-express';
const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // No larger than 5mb
	},
})
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post("addsubcategory")
	@UsePipes(new ValidationPipe())
	addsubcategory(@Body() dto: addSubcategory) {
		return this.categoryService.addSubcategory(dto)
	}
  @Post("createcategory")
		@UseInterceptors(FilesInterceptor("img[]", 1, multer))
	createcategory(@UploadedFile() file: Multer.File,@Body() dto: createCategoryDto) {
		return this.categoryService.createCategory(file, dto)
	}
  @Get("getcategories")
	@UsePipes(new ValidationPipe())
	getcategories() {
		return this.categoryService.getCategories()
	}
  @Get("getonecategory")
	@UsePipes(new ValidationPipe())
	getonecategory(@Query("id") id: string) {
		return this.categoryService.getOneCategory(id)
	}

	@Post("changecategory")
	@UsePipes(new ValidationPipe())
	changecategory(@Body() dto: changeCategoryDto) {
		return this.categoryService.changeCategory(dto)
	}
	@Post("changesubcategory")
	@UsePipes(new ValidationPipe())
	changesubcategory(@Body() dto: changeSubcategoryDto) {
		return this.categoryService.changeSubcategory(dto)
	}
	@Post("deletecategory")
	@UsePipes(new ValidationPipe())
	deletecategory(@Body() dto: deleteCategoryDto) {
		return this.categoryService.deleteCategory(dto)
	}
	@Post("deletesubcategory")
	@UsePipes(new ValidationPipe())
	deletesubcategory(@Body() dto: deleteSubcategoryDto) {
		return this.categoryService.deleteSubcategory(dto)
	}
}

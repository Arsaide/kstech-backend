import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { CategoryService } from './category.service';
import { addSubcategory, changeCategoryDto, changeSubcategoryDto, createCategoryDto, deleteCategoryDto, deleteSubcategoryDto } from './category.dto';
import * as Multer from "multer"
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(
    FileFieldsInterceptor([
        { name: 'mainImg', maxCount: 1 },
        { name: 'iconImg', maxCount: 1 }
    ], { storage: Multer.memoryStorage() })
)
addsubcategory(@UploadedFiles() files: { mainImg?: Multer.File, iconImg?: Multer.File }, @Body() dto: addSubcategory) {
    return this.categoryService.addSubcategory(files, dto);
	
}

	@Post('createcategory')
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'mainImg', maxCount: 1 },
			{ name: 'iconImg', maxCount: 1 }
		], { storage: Multer.memoryStorage() })
	)
	createCategory(@UploadedFiles() files: { mainImg?: Multer.File, iconImg?: Multer.File }, @Body() dto: createCategoryDto) {

	  return this.categoryService.createCategory(files, dto);
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

	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'mainImg', maxCount: 1 },
			{ name: 'iconImg', maxCount: 1 }
		], { storage: Multer.memoryStorage() })
	)
	changecategory(@UploadedFiles() files: { mainImg?: Multer.File[], iconImg?: Multer.File[] },@Body() dto: changeCategoryDto) {
		return this.categoryService.changeCategory(files,dto)
	}
	@Post("changesubcategory")
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: 'mainImg', maxCount: 1 },
			{ name: 'iconImg', maxCount: 1 }
		], { storage: Multer.memoryStorage() })
	)
	changesubcategory(@UploadedFiles() files: { mainImg?: Multer.File[], iconImg?: Multer.File[] }, @Body() dto: changeSubcategoryDto) {
		
		return this.categoryService.changeSubcategory(files,dto)
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

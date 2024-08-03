import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common"
import {ProductsService} from "./products.service"
import {
	addSubcategory,
	BuyDto,
	changeDto,
	createCategoryDto,
	createDto,
	getForCategoryDto,
	getForSubcategoryDto,
} from "./products.dto"
import * as Multer from "multer"
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express"
// import { query } from 'express';

const multer = Multer({
	storage: Multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // No larger than 5mb
	},
})

@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}
	@Post("create")
	@UseInterceptors(FilesInterceptor("img[]", 10, multer))
	create(@UploadedFiles() file: Multer.File[], @Body() dto: createDto) {
		return this.productsService.create(file, dto)
	}
	@Post("change")
	@UseInterceptors(FilesInterceptor("img[]", 10, multer))
	change(@UploadedFiles() file: Multer.File[], @Body() dto: changeDto) {
		return this.productsService.change(file, dto)
	}

	@Get("getone")
	@UsePipes(new ValidationPipe())
	getone(@Query("id") id: string) {
		return this.productsService.getOne(id)
	}
	@Get("search")
	@UsePipes(new ValidationPipe())
	search(@Query('page') page: string, @Query('query') query: string ) {
		return this.productsService.search(page, query);
	  }
	@Get("get")
	@UsePipes(new ValidationPipe())
	get(@Query("page") page: number) {
		return this.productsService.get(page)
	}
	@Get("delete")
	@UsePipes(new ValidationPipe())
	delete(@Query("id") id: string, @Query("token") token: string) {
		return this.productsService.delete(id, token)
	}
 @Get("getforcategory")
	@UsePipes(new ValidationPipe())
	getforcategory(@Query() query: getForCategoryDto) {
		return this.productsService.getForCategory(query)
	}
	@Get("getforsubcategory")
	@UsePipes(new ValidationPipe())
	getforsubcategory(@Query() query: getForSubcategoryDto) {
		return this.productsService.getForSubcategory(query)
	}
	@Get("getforpromotions")
	@UsePipes(new ValidationPipe())
	getforpromotions(@Query() query: getForSubcategoryDto) {
		return this.productsService.getForPromotions(query)
	}
	@Post("buy")
	@UsePipes(new ValidationPipe())
	buy( @Body() dto: BuyDto) {
		return this.productsService.buy(dto)
	}
}

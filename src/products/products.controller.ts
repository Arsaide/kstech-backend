import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { createDto } from './product.dto';
import * as Multer from 'multer';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // No larger than 5mb
    },
});


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post('create')
  @UseInterceptors(FilesInterceptor('img', 10, multer))
  create(@UploadedFiles() file: Multer.File[], @Body() dto:createDto) {
   
    return this.productsService.create(file,dto)
  }


  @Get('get')
  @UsePipes(new ValidationPipe())
  get() {
    return this.productsService.get();
  }
}

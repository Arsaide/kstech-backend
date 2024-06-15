import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { createDto } from './product.dto';
import * as Multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';


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
  @UseInterceptors(FileInterceptor('img', { storage: multer.storage, limits: multer.limits }))
  create(@UploadedFile() file: Multer.File,dto:createDto) {
    return this.productsService.create(file,dto)
  }


  @Get('get')
  @UsePipes(new ValidationPipe())
  get() {
    return this.productsService.get();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createDto } from './product.dto';
import * as Multer from 'multer';
import verifyToken from 'middleware/verifyToken';
// import {uploadFile} from "../../middleware/create"
require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});
function uploadFile(file) {
  const params = {
    Bucket: bucketName,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return s3.upload(params).promise();
}
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async create(file: Multer.File[], dto: createDto) {
    const { user } = await verifyToken(dto.token,this.prisma);
    if (!user) {
      throw new NotFoundException(
        'The user with the given identifier was not found.',
      );
    }

    const uploadPromises = file.map(async (files) => {
      await uploadFile(files);
      return `https://faralaer.s3.eu-west-2.amazonaws.com/${files.originalname}`;
    });

    let arr = await Promise.all(uploadPromises);

    console.log(dto);
    await this.prisma.product.create({
      data: {
        name: dto.name,
        colors: dto.colors,
        description: dto.description,
        price: Number(dto.price),
        inAvailability: dto.inAvailability,
        category: dto.category,
        subcategory: dto.subcategory,
        weight: dto.weight,
        height: dto.height,
        imgArr: arr,
      },
    });

    return 'fileName';
  }
  async get() {
    const res = await this.prisma.product.findMany();
    return res;
  }
}

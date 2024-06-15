import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createDto } from './product.dto';
import * as Multer from 'multer';
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
  async create(file: Multer.File, dto: createDto) {
    await uploadFile(file);
    const fileName = `https://faralaer.s3.eu-west-2.amazonaws.com/${file.originalname}`;
    // await this.prisma.product.create({
    //   data: dto,
    // });

    return fileName;
  }
  async get() {
    const res = await this.prisma.product.findMany();
    return res;
  }
}

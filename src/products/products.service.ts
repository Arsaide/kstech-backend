import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { changeDto, createCategoryDto, createDto } from "./products.dto";
import * as Multer from "multer";
import verifyToken from "middleware/verifyToken";
import generateUniqueArticle from "middleware/generateartcile";
import { contains } from "class-validator";
import { deleteFile, uploadFile } from "middleware/saveImg";
// import {uploadFile} from "../../middleware/create"
require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
const EmailSend = require("../../middleware/email.js");
const emailSend = new EmailSend();
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region: region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});
// function uploadFile(file) {
//   const params = {
//     Bucket: bucketName,
//     Key: file.originalname,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };
//   return s3.upload(params).promise();
// }

// function deleteFile(fileName) {
//   const params = {
//     Bucket: bucketName,
//     Key: fileName,
//   };
//   return s3.deleteObject(params).promise();
// }
function getFile(fileName) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };
  return s3
    .getObject(params)
    .promise()
    .then((data) => data.Body);
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async create(file: Multer.File[], dto: createDto) {
    try {
      const { user } = await verifyToken(dto.token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }
      let deliveryMethodArr = dto.deliveryMethod;
      let turningMethodArr = dto.turningMethod;
      let discount = Number(dto.discount);
      let arr = [];
      const uploadPromises = file.map(async (files) => {
        const link = await uploadFile(files);

        arr.push(link);
      });

      await Promise.all(uploadPromises);

      const article = generateUniqueArticle();
      let colorArr = dto.colors;
      if (typeof dto.colors == "string") {
        colorArr = [dto.colors];
      }
      let paymentMethodArr = dto.paymentMethod;
      // const deliveryMethodArr = dto.deliveryMethod.split(",")
      if (typeof dto.paymentMethod == "string") {
        paymentMethodArr = [dto.paymentMethod];
      }

      if (typeof dto.turningMethod == "string") {
        turningMethodArr = [dto.turningMethod];
      }
      if (typeof dto.deliveryMethod == "string") {
        deliveryMethodArr = [dto.deliveryMethod];
      }
      if (Number(dto.discount) < 0) {
        discount = Number(0);
      }

      await this.prisma.product.create({
        data: {
          name: dto.name,
          colors: colorArr,
          description: dto.description,
          price: Number(dto.price),
          inAvailability: dto.inAvailability,
          category: dto.category,
          subcategory: dto.subcategory,
          weight: dto.weight,
          height: dto.height,
          imgArr: arr,
          country: dto.country,
          paymentMethod: paymentMethodArr,
          turningMethod: turningMethodArr,
          deliveryMethod: deliveryMethodArr,
          article: article,
          discount: discount,
          long: dto.long,
          width: dto.width,
        },
      });

      return "all good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async change(file: Multer.File[], dto: changeDto) {
    try {
      const { user } = await verifyToken(dto.token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }

      let arry = [];
      let oldImgArr = dto.oldImg;
      let discount = dto.discount;
      if (file) {
        const uploadPromises = file.map(async (files) => {
          const link = await uploadFile(files);
          arry.push(link);
        });

        await Promise.all(uploadPromises);
      }
      const product = await this.prisma.product.findFirst({
        where: { id: dto.id },
      });
      if (dto.oldImg) {
        let arrOldDelte: string[] = Array.isArray(oldImgArr)
          ? oldImgArr
          : oldImgArr.split(",");

        const arrdelete = product.imgArr.filter(
          (element) => !arrOldDelte.includes(element)
        );

        if (arrdelete) {
          for (let i = 0; i < arrdelete.length; i++) {
            const uploadPromises = arrdelete.map(async (files) => {
              await deleteFile(files);
            });
            await Promise.all(uploadPromises);
          }
        }
      } else {
        const uploadPromises = product.imgArr.map(async (files) => {
          await deleteFile(files);
        });
        await Promise.all(uploadPromises);
      }
      if (oldImgArr) {
        let old: any = oldImgArr;
        if (typeof oldImgArr == "string") {
          old = oldImgArr.split(",");
        }

        arry = [...arry, ...old];
      }

      let colorArr = dto.colors;
      if (typeof dto.colors == "string") {
        colorArr = [dto.colors];
      }
      let turningMethodArr = dto.turningMethod;
      if (typeof dto.turningMethod == "string") {
        turningMethodArr = [dto.turningMethod];
      }
      let paymentMethodArr = dto.paymentMethod;
      let deliveryMethodArr = dto.deliveryMethod;

      if (typeof dto.deliveryMethod == "string") {
        deliveryMethodArr = [dto.deliveryMethod];
      }
      if (typeof dto.paymentMethod == "string") {
        paymentMethodArr = [dto.paymentMethod];
      }
      if (Number(dto.discount) < 0) {
        discount = 0;
      }

      await this.prisma.product.update({
        where: { id: dto.id },
        data: {
          name: dto.name,
          colors: colorArr,
          description: dto.description,
          price: Number(dto.price),
          inAvailability: dto.inAvailability,
          category: dto.category,
          subcategory: dto.subcategory,
          weight: dto.weight,
          height: dto.height,
          imgArr: arry,
          paymentMethod: paymentMethodArr,
          turningMethod: turningMethodArr,
          deliveryMethod: deliveryMethodArr,
          country: dto.country,
          discount: Number(discount),
          long: dto.long,
          width: dto.width,
        },
      });

      return "all good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async getOne(id) {
    try {
      let products = await this.prisma.product.findFirst({
        where: {
          id: id,
        },
      });
      if (!products) {
        throw new NotFoundException(
          "The product with the given identifier was not found."
        );
      }
      let subcategory;
      let category;
      if (products.category) {
        category = await this.prisma.category.findFirst({
          where: {
            id: products.category,
          },
        });
      }

      if (products.subcategory) {
        subcategory = await this.prisma.subcategory.findFirst({
          where: {
            id: products.subcategory,
          },
        });
      }
      const product = {
        ...products,
        categoryName: category ? category.category : null,
        subcategoryName: subcategory ? subcategory.subcategory : null,
      };
      return {
        product,
      };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async get(page: number) {
    try {
      const totalProducts = await this.prisma.product.count();
      const products = await this.prisma.product.findMany({
        take: 20,
        skip: (page - 1) * 20,
      });
      const productsPerPage = 20;
      const totalPages = Math.ceil(totalProducts / productsPerPage);

      return {
        products,
        totalPages,
      };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async search(page: string, query: string) {
    try {
      let products;
      let totalPages;

      const totalProducts = await this.prisma.product.count({
        where: {
          OR: [
            {
              name: {
                contains: query.toLowerCase(),
                mode: "insensitive", // делаем поиск нечувствительным к регистру
              },
            },
            {
              description: {
                contains: query.toLowerCase(),
                mode: "insensitive", // делаем поиск нечувствительным к регистру
              },
            },
            {
              article: {
                contains: query.toLowerCase(),
                mode: "insensitive",
              },
            },
          ],
        },
      });

      totalPages = Math.ceil(totalProducts / 20);

      products = await this.prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query.toLowerCase(),
                mode: "insensitive", // делаем поиск нечувствительным к регистру
              },
            },
            {
              description: {
                contains: query.toLowerCase(),
                mode: "insensitive", // делаем поиск нечувствительным к регистру
              },
            },
            {
              article: {
                contains: query.toLowerCase(),
                mode: "insensitive",
              },
            },
          ],
        },
        skip: (parseInt(page) - 1) * 20,
        take: 20,
      });

      return { products, totalPages };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async delete(id, token) {
    try {
      const { user } = await verifyToken(token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }
      const product = await this.prisma.product.findFirst({
        where: {
          id: id,
        },
      });
      const uploadPromises = product.imgArr.map(async (files) => {
        await deleteFile(files);
      });
      await Promise.all(uploadPromises);
      await this.prisma.product.delete({
        where: {
          id: id,
        },
      });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async getForCategory(query) {
    try {
      const totalProducts = await this.prisma.product.count({
        where: {
          category: query.category,
        },
      });
      const category = await this.prisma.category.findFirst({
        where: {
          id: query.category,
        },
      });
      const Category = { category: category.category, id: category.id };
      // Calculate the total number of pages
      const pageSize = 20;
      const totalPages = Math.ceil(totalProducts / pageSize);
      const products = await this.prisma.product.findMany({
        where: {
          category: query.category,
        },
        take: 20,
        skip: (query.page - 1) * 20,
      });
      return { products, totalPages, Category };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
  async getForSubcategory(query) {
    try {
      const totalProducts = await this.prisma.product.count({
        where: {
          subcategory: query.subcategory,
        },
      });
      const subcategory = await this.prisma.subcategory.findFirst({
        where: {
          id: query.subcategory,
        },
      });
      const Subcategory = {
        subcategory: subcategory.subcategory,
        id: subcategory.id,
      };
      const category = await this.prisma.category.findFirst({
        where: {
          id: subcategory.categoryId,
        },
      });
      const Category = { category: category.category, id: category.id };
      // Calculate the total number of pages
      const pageSize = 20;
      const totalPages = Math.ceil(totalProducts / pageSize);
      const products = await this.prisma.product.findMany({
        where: {
          subcategory: query.subcategory,
        },
        take: 20,
        skip: (query.page - 1) * 20,
      });
      return { products, totalPages, Category, Subcategory };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
  async getForPromotions(query) {
    try {
      const totalProducts = await this.prisma.product.count({
        where: {
          discount: {
            gt: 0,
          },
        },
      });
      const pageSize = 20;
      const totalPages = Math.ceil(totalProducts / pageSize);
      const skip = (query.page - 1) * pageSize;
      // Получаем продукты с учетом пагинации и фильтрации по наличию скидки
      const products = await this.prisma.product.findMany({
        skip: skip,
        take: pageSize,
        where: {
          discount: {
            gt: 0,
          },
        },
      });

      return { products, totalPages };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
  async buy(dto) {
    try {
      const products = await this.prisma.product.findFirst({
        where: {
          id: dto.id,
        },
      });

      const obj = {
        products: dto.products,
        client: dto.client,
      };
      await emailSend.sendmessage({ products: obj });
      return "al good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
}

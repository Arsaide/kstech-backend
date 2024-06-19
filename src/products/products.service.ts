import {Injectable, NotFoundException} from "@nestjs/common"
import {PrismaService} from "src/prisma.service"
import {changeDto, createDto} from "./product.dto"
import * as Multer from "multer"
import verifyToken from "middleware/verifyToken"
import generateUniqueArticle from "middleware/generateartcile"
// import {uploadFile} from "../../middleware/create"
require("dotenv").config()
const fs = require("fs")
const S3 = require("aws-sdk/clients/s3")

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
	region: region,
	accessKeyId: accessKeyId,
	secretAccessKey: secretAccessKey,
})
function uploadFile(file) {
	const params = {
		Bucket: bucketName,
		Key: file.originalname,
		Body: file.buffer,
		ContentType: file.mimetype,
	}
	return s3.upload(params).promise()
}
// function deleteFile(fileName) {
//   const params = {
//     Bucket: bucketName,
//     Key: fileName,
//   };
//   return s3.deleteObject(params).promise();
// }
@Injectable()
export class ProductsService {
	constructor(private prisma: PrismaService) {}
	async create(file: Multer.File[], dto: createDto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}

		const uploadPromises = file.map(async (files) => {
			await uploadFile(files)
			return `https://faralaer.s3.eu-west-2.amazonaws.com/${files.originalname}`
		})

		const arr = await Promise.all(uploadPromises)
		const article = generateUniqueArticle()
		const colorArr = dto.colors.split(",")

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
				paymentMethod: dto.paymentMethod,
				turningMethod: dto.turningMethod,
				deliveryMethod: dto.deliveryMethod,
				article: Number(article),
        discounts:Number(dto.discounts)
			},
		})

		return "all good"
	}
	async change(file: Multer.File[], dto: changeDto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}

		const uploadPromises = file.map(async (files) => {
			await uploadFile(files)
			return `https://faralaer.s3.eu-west-2.amazonaws.com/${files.originalname}`
		})

		const arr = await Promise.all(uploadPromises)
		const colorArr = dto.colors.split(",")
		await this.prisma.product.update({
			where: {id: dto.id},
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
				deliveryMethod: dto.deliveryMethod,
				paymentMethod: dto.paymentMethod,
				turningMethod: dto.turningMethod,
				article: Number(dto.article),
        discounts:Number(dto.discounts)
			},
		})

		return "all good"
	}
	async getOne(id) {
		const product = await this.prisma.product.findFirst({
			where: {
				id: id,
			},
		})
		return product
	}
	async get(page: number) {
		const totalProducts = await this.prisma.product.count()
		const products = await this.prisma.product.findMany({
			take: 10,
			skip: (page - 1) * 10,
		})
		const productsPerPage = 10
		const totalPages = Math.ceil(totalProducts / productsPerPage)

		return {
			products,
			totalPages,
		}
	}
	async delete(id, token) {
		const {user} = await verifyToken(token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}

		await this.prisma.product.delete({
			where: {
				id: id,
			},
		})
	}
}

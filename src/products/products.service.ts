import {Injectable, NotFoundException} from "@nestjs/common"
import {PrismaService} from "src/prisma.service"
import {changeDto, createCategoryDto, createDto} from "./product.dto"
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
function getFile(fileName) {
	const params = {
		Bucket: bucketName,
		Key: fileName,
	}
	return s3
		.getObject(params)
		.promise()
		.then((data) => data.Body)
}

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
		const paymentMethodArr = dto.paymentMethod
		// const deliveryMethodArr = dto.deliveryMethod.split(",")

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
				paymentMethod: paymentMethodArr,
				turningMethod: dto.turningMethod,
				deliveryMethod: dto.deliveryMethod,
				article: Number(article),
				discount: Number(dto.discount),
				long: dto.long,
				width: dto.width,
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
		let oldImgArr = dto.oldImg
		const uploadPromises = file.map(async (files) => {
			await uploadFile(files)
			return `https://faralaer.s3.eu-west-2.amazonaws.com/${files.originalname}`
		})
		console.log(oldImgArr)
		const arr = await Promise.all(uploadPromises)

		let arry = arr.concat(oldImgArr)
		console.log(arry)
		const colorArr = dto.colors.split(",")
		const paymentMethodArr = dto.paymentMethod

		console.log(dto.deliveryMethod)
		console.log(dto.deliveryMethod[2])
		// console.log( deliveryMethodArr)
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
				imgArr: arry,
				paymentMethod: paymentMethodArr,
				turningMethod: dto.turningMethod,
				deliveryMethod: dto.deliveryMethod,

				discount: Number(dto.discount),
				long: dto.long,
				width: dto.width,
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
		if (!product) {
			throw new NotFoundException(
				"The product with the given identifier was not found."
			)
		}

		return {
			product,
		}
	}

	async get(page: number) {
		const totalProducts = await this.prisma.product.count()
		const products = await this.prisma.product.findMany({
			take: 20,
			skip: (page - 1) * 20,
		})
		const productsPerPage = 20
		const totalPages = Math.ceil(totalProducts / productsPerPage)

		return {
			products,
			totalPages,
		}
	}
	async search(page: string, query: string) {
		const skip = (parseInt(page) - 1) * 20 // Assuming page starts from 1 and each page shows 10 items
		const take = await this.prisma.product.count()

		const products = await this.prisma.product.findMany({
			where: {
				OR: [
					{
						name: {
							contains: query,
						},
					},
					{
						description: {
							contains: query,
						},
					},
				],
			},
			skip,
			take,
		})
		return {products}
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

	async createCategory(dto: createCategoryDto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		await this.prisma.category.create({
			data: {
				name: dto.name,
				subcategory: [],
			},
		})
		return "all good"
	}
	async getCategory() {
		const category = await this.prisma.category.findMany()
		return category
	}
	async getOneCategory(id) {
		const category = await this.prisma.category.findFirst({
			where: {
				id: id,
			},
		})
		return category
	}
	async addSubcategory(dto) {
		const category = await this.prisma.category.findFirst({
			where: {
				id: dto.id,
			},
		})
	}
}

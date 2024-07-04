import {Injectable, NotFoundException} from "@nestjs/common"
import verifyToken from "middleware/verifyToken"
import {PrismaService} from "src/prisma.service"
import {createCategoryDto} from "./category.dto"

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}
	async createCategory(dto: createCategoryDto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		const category = await this.prisma.category.findFirst({
			where: {
				category: dto.category,
			},
		})
		if (category) {
			throw new NotFoundException("this name is taken.")
		}
		await this.prisma.category.create({
			data: {
				category: dto.category,
				subcategory: [],
			},
		})
		return "all good"
	}
	async getCategories() {
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
		await this.prisma.category.update({
			where: {
				id: dto.id,
			},
			data: {
				subcategory: {
					push: dto.subcategory,
				},
			},
		})
		return "all good"
	}

	async changeCategory(dto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		const category = await this.prisma.category.findFirst({
			where: {id: dto.id},
		})
		await this.prisma.product.updateMany({
			where: {
				category: category.category,
			},
			data: {
				category: dto.newName,
			},
		})
		await this.prisma.category.update({
			where: {
				id: dto.id,
			},
			data: {
				category: dto.newName,
			},
		})
		return "all good"
	}

	async changeSubcategory(dto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		await this.prisma.product.updateMany({
			where: {
				subcategory: dto.oldName,
			},
			data: {
				subcategory: dto.newName,
			},
		})
		const arr = await this.prisma.category.findFirst({
			where: {
				id: dto.id,
			},
		})

		const arry = arr.subcategory.map((item) =>
			item === dto.oldName ? dto.newName : item
		)

		await this.prisma.category.update({
			where: {
				id: dto.id,
			},
			data: {
				subcategory: arry,
			},
		})

		return "all good"
	}

	async deleteCategory(dto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		await this.prisma.product.updateMany({
			where: {
				category: dto.category,
			},
			data: {
				category: "",
				subcategory: "",
			},
		})
		await this.prisma.category.delete({
			where: {category: dto.category},
		})
		return "all good"
	}
	async deleteSubcategory(dto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		await this.prisma.product.updateMany({
			where: {
				subcategory: dto.subcategory,
			},
			data: {
				subcategory: "",
			},
		})
		const arr = await this.prisma.category.findFirst({
			where: {
				category: dto.category,
			},
		})

		const arry = arr.subcategory.filter((item) => item !== dto.subcategory)
		console.log(arr)
		console.log(arry)
		await this.prisma.category.update({
			where: {
				category: dto.category,
			},
			data: {
				subcategory: arry,
			},
		})
		return "all good"
	}
}

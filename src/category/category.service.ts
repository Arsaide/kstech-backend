import { Injectable, NotFoundException } from '@nestjs/common';
import verifyToken from 'middleware/verifyToken';
import { PrismaService } from 'src/prisma.service';
import { createCategoryDto } from './category.dto';

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
		const category=await this.prisma.category.findFirst({where:{id:dto.id}})
		await this.prisma.product.updateMany({
			where: {
				subcategory:category.category,
			},
			data: {
				category:dto.category
			},
		})
       await this.prisma.category.update({
			where: {
				id: dto.id,
			},
			data: {
				category:dto.category
			},
		})
		return "all good"
	}

	async changeSubcategory(dto) {}
}

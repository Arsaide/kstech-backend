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
}

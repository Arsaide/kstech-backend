import {Injectable, NotFoundException} from "@nestjs/common"
import verifyToken from "middleware/verifyToken"
import {PrismaService} from "src/prisma.service"
import {createCategoryDto} from "./category.dto"
import generateUniqueArticle from "middleware/generateartcile"
import {deleteFile, uploadFile} from "middleware/saveImg"





@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}
	async createCategory(file, dto: createCategoryDto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}

		const name = generateUniqueArticle()

		uploadFile(file[0],name)
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
				img: `https://faralaer.s3.eu-west-2.amazonaws.com/${name}`,
				subcategories:{ create: [] },
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
		const subcategory = await this.prisma.subcategory.findMany({
			where: {
				categoryId : id,
			},
		})
		
		return {category ,
			 subcategory};
	}




	async addSubcategory(file,dto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		const subcategory =await this.prisma.subcategory.findFirst({
			where:{
				subcategory:dto.subcategory,
			}
		})
 if(subcategory){
	throw new NotFoundException(
		"This name is taken."
	)
 }

		const name = generateUniqueArticle()

		uploadFile(file[0],name)
	
		
		await this.prisma.category.update({
			where: {
				id: dto.id,
			},
			data: {
				subcategories: {
					create: {
						subcategory: dto.subcategory,
						img: `https://faralaer.s3.eu-west-2.amazonaws.com/${name}`,
				},

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
		});
		await this.prisma.subcategory.update({
			where:{
				subcategory:dto.oldName
			},
			data:{
				subcategory:dto.newName
			}
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
 const category =await this.prisma.category.findFirst({
	where:{
		id:dto.id
	}
 })
 if (!category) {
	throw new NotFoundException(
		"category didnt found."
	)
}
const subcategory=await this.prisma.subcategory.findMany({
	where:{
		categoryId:dto.id
	}
})
if (subcategory) {
	for(let i=0;i<await subcategory.length;i++){
	deleteFile(subcategory[0].img)
}
}

deleteFile(category.img)
await this.prisma.subcategory.deleteMany({
	where:{
		categoryId:dto.id
	}
})
		await this.prisma.category.delete({
			where: {id :dto.id},
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
		const subcategory=await this.prisma.subcategory.findFirst({
			where:{
				subcategory:dto.subcategory 
			}
		})
  if(!subcategory){
	throw new NotFoundException(
		"The subcategory with the given identifier was not found."
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
		const url =subcategory.img
		deleteFile(url)
		await this.prisma.subcategory.delete({
			where:{
				subcategory:dto.subcategory 
			}
		})

		return "all good"
	}
}

import {Injectable, NotFoundException} from "@nestjs/common"
import verifyToken from "middleware/verifyToken"
import {PrismaService} from "src/prisma.service"
import {createCategoryDto} from "./category.dto"
import generateUniqueArticle from "middleware/generateartcile"
import {deleteFile, uploadFile} from "middleware/saveImg"


interface UpdateSubcategoryDto {
	iconimg?:string
	subcategory?: string;
	mainImg?: string;
}

interface UpdateCategoryDto {
	iconimg?:string
	category?: string;
	mainImg?: string;
}
interface IData{
	img: string |  null;
    subcategory:string|null
}

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}
	async createCategory(files, dto: createCategoryDto) {
		const mainImgFile = files.mainImg ? files.mainImg[0] : null;
		const iconimgFile = files.iconimg ? files.iconimg[0] : null;
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}

		const iconimg=uploadFile(iconimgFile)
	const mainImg=uploadFile(mainImgFile)

		
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
				mainImg: mainImg,
				iconimg: iconimg,
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




	async addSubcategory(files,dto) {
		const mainImgFile = files.mainImg ? files.mainImg[0] : null;
		const iconimgFile = files.iconimg ? files.iconimg[0] : null;
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

		

		const iconimg=uploadFile(iconimgFile)
	const mainImg=uploadFile(mainImgFile)
		
		await this.prisma.category.update({
			where: {
				id: dto.id,
			},
			data: {
				subcategories: {
					create: {
						subcategory: dto.subcategory,
						mainImg: mainImg,
						iconimg: iconimg,
				},

				},
			},
		})
		return "all good"
	}

	async changeCategory(files,dto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		let data:UpdateCategoryDto={}
		const category = await this.prisma.category.findFirst({
			where: {
				id: dto.id
			},
		})
		if(files){
			const mainImgFile = files.mainImg ? files.mainImg[0] : null;
			const iconimgFile = files.iconimg ? files.iconimg[0] : null;
			deleteFile(category.iconimg)
			deleteFile(category.mainImg)
			data.iconimg=await uploadFile(iconimgFile)
			data.mainImg=await uploadFile(mainImgFile)
		}
		if (dto.newName) {
			data.category = dto.newName;
		  }
		  if(dto.newName){
					await this.prisma.product.updateMany({
					where: {
						category: category.category,
					},
					data:{
						category:dto.newName
						
					}
				});}
		
		await this.prisma.category.update({
			where: {
				id: dto.id,
			},
			data: data
		})
		return "all good"
	}

	async changeSubcategory(files,dto) {
		const {user} = await verifyToken(dto.token, this.prisma)
		if (!user) {
			throw new NotFoundException(
				"The user with the given identifier was not found."
			)
		}
		let data:UpdateSubcategoryDto={}
		if(files){
			
	const subcategory=await this.prisma.subcategory.findFirst({
		where:{
			subcategory: dto.oldName,
		}
	})		
	const mainImgFile = files.mainImg ? files.mainImg[0] : null;
	const iconimgFile = files.iconimg ? files.iconimg[0] : null;
	deleteFile(subcategory.iconimg)
	deleteFile(subcategory.mainImg)
    data.iconimg=await uploadFile(iconimgFile)
	data.mainImg=await uploadFile(mainImgFile)
	
}	
  if (dto.newName) {
    data.subcategory = dto.newName;
  }
  if(dto.newName){
			await this.prisma.product.updateMany({
			where: {
				subcategory: dto.oldName,
			},
			data:{
				subcategory:dto.newName
				
			}
		});
		

		}
		await this.prisma.subcategory.update({
			where:{
				subcategory:dto.oldName
			},
			data:data
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
	deleteFile(subcategory[i-1].mainImg)
	deleteFile(subcategory[i-1].iconimg)
}
}
deleteFile(category.mainImg)
deleteFile(category.iconimg)
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
		const url =subcategory.iconimg
		deleteFile(url)
		const url2 =subcategory.mainImg
		deleteFile(url2)
		await this.prisma.subcategory.delete({
			where:{
				subcategory:dto.subcategory 
			}
		})

		return "all good"
	}
}

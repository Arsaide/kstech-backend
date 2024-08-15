import { Injectable, NotFoundException } from "@nestjs/common";
import verifyToken from "middleware/verifyToken";
import { PrismaService } from "src/prisma.service";
import { createCategoryDto } from "./category.dto";
import generateUniqueArticle from "middleware/generateartcile";
import { deleteFile, uploadFile } from "middleware/saveImg";

interface UpdateSubcategoryDto {
  iconImg?: string;
  subcategory?: string;
  mainImg?: string;
}

interface UpdateCategoryDto {
  iconImg?: string;
  category?: string;
  mainImg?: string;
}
interface IData {
  img: string | null;
  subcategory: string | null;
}

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async createCategory(files, dto: createCategoryDto) {
    try {
      const mainImgFile = files.mainImg ? files.mainImg[0] : null;
      const iconImgFile = files.iconImg ? files.iconImg[0] : null;
      const { user } = await verifyToken(dto.token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }

      const iconImg = uploadFile(iconImgFile);
      const mainImg = uploadFile(mainImgFile);

      const category = await this.prisma.category.findFirst({
        where: {
          category: dto.category,
        },
      });
      if (category) {
        throw new NotFoundException("this name is taken.");
      }
      await this.prisma.category.create({
        data: {
          category: dto.category,
          mainImg: mainImg,
          iconImg: iconImg,
          subcategories: { create: [] },
        },
      });
      return "all good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async getCategories() {
    try {
      const category = await this.prisma.category.findMany();
      return category;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async getOneCategory(id) {
    try {
      const category = await this.prisma.category.findFirst({
        where: {
          id: id,
        },
      });
      const subcategory = await this.prisma.subcategory.findMany({
        where: {
          categoryId: id,
        },
      });

      return { category, subcategory };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async addSubcategory(files, dto) {
    try {
      const mainImgFile = files.mainImg ? files.mainImg[0] : null;
      const iconImgFile = files.iconImg ? files.iconImg[0] : null;
      const { user } = await verifyToken(dto.token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }
      const subcategory = await this.prisma.subcategory.findFirst({
        where: {
          subcategory: dto.subcategory,
        },
      });
      if (subcategory) {
        throw new NotFoundException("This name is taken.");
      }

      const iconImg = uploadFile(iconImgFile);
      const mainImg = uploadFile(mainImgFile);

      await this.prisma.category.update({
        where: {
          id: dto.id,
        },
        data: {
          subcategories: {
            create: {
              subcategory: dto.subcategory,
              mainImg: mainImg,
              iconImg: iconImg,
            },
          },
        },
      });
      return "all good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async changeCategory(files, dto) {
    try {
      const { user } = await verifyToken(dto.token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }
      let data: UpdateCategoryDto = {};
      const category = await this.prisma.category.findFirst({
        where: {
          id: dto.id,
        },
      });

      if (
        files.mainImg &&
        Array.isArray(files.mainImg) &&
        files.mainImg.length > 0
      ) {
        
        const mainImgFile = files.mainImg ? files.mainImg[0] : null;
        const iconImgFile = files.iconImg ? files.iconImg[0] : null;
        deleteFile(category.iconImg);
        deleteFile(category.mainImg);
        data.iconImg = await uploadFile(iconImgFile);
        data.mainImg = await uploadFile(mainImgFile);
      }
      if (dto.newName) {
        data.category = dto.newName;
      }
      if (dto.newName) {
        // 	await this.prisma.product.updateMany({
        // 	where: {
        // 		category: category.category,
        // 	},
        // 	data:{
        // 		category:dto.newName
        // 	}
        // });
      }

      await this.prisma.category.update({
        where: {
          id: dto.id,
        },
        data: data,
      });
      return "all good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async changeSubcategory(files, dto) {
    try {
      const { user } = await verifyToken(dto.token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }
      let data: UpdateSubcategoryDto = {};
      const subcategory = await this.prisma.subcategory.findFirst({
        where: {
          id: dto.id,
        },
      });
      if (
        files.mainImg &&
        Array.isArray(files.mainImg) &&
        files.mainImg.length > 0
      ) {
        if (!subcategory) {
          throw new NotFoundException("the subcategory was not found.");
        }
        const mainImgFile = files.mainImg ? files.mainImg[0] : null;
        const iconImgFile = files.iconImg ? files.iconImg[0] : null;
        deleteFile(subcategory.iconImg);
        deleteFile(subcategory.mainImg);
        data.iconImg = await uploadFile(iconImgFile);
        data.mainImg = await uploadFile(mainImgFile);
      }

      if (dto.newName) {
        data.subcategory = dto.newName;
      }
      if (dto.newName) {
        // 	await this.prisma.product.updateMany({
        // 	where: {
        // 		subcategory: subcategory.id,
        // 	},
        // 	data:{
        // 		subcategory:dto.newName
        // 	}
        // });
      }
      await this.prisma.subcategory.update({
        where: {
          subcategory: subcategory.subcategory,
        },
        data: data,
      });

      return "all good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async deleteCategory(dto) {
    try {
      const { user } = await verifyToken(dto.token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }
      await this.prisma.product.updateMany({
        where: {
          category: dto.id,
        },
        data: {
          category: "",
          subcategory: "",
        },
      });
      const category = await this.prisma.category.findFirst({
        where: {
          id: dto.id,
        },
      });
      if (!category) {
        throw new NotFoundException("category didnt found.");
      }
      const subcategory = await this.prisma.subcategory.findMany({
        where: {
          categoryId: dto.id,
        },
      });
      if (subcategory) {
        for (let i = 0; i < (await subcategory.length); i++) {
          deleteFile(subcategory[i - 1].mainImg);
          deleteFile(subcategory[i - 1].iconImg);
        }
      }
      deleteFile(category.mainImg);
      deleteFile(category.iconImg);
      await this.prisma.subcategory.deleteMany({
        where: {
          categoryId: dto.id,
        },
      });
      await this.prisma.category.delete({
        where: { id: dto.id },
      });
      return "all good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async deleteSubcategory(dto) {
    try {
      const { user } = await verifyToken(dto.token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }
      const subcategory = await this.prisma.subcategory.findFirst({
        where: {
          subcategory: dto.subcategory,
        },
      });
      if (!subcategory) {
        throw new NotFoundException(
          "The subcategory with the given identifier was not found."
        );
      }
      await this.prisma.product.updateMany({
        where: {
          subcategory: subcategory.id,
        },
        data: {
          subcategory: "",
        },
      });
      const url = subcategory.iconImg;
      deleteFile(url);
      const url2 = subcategory.mainImg;
      deleteFile(url2);
      await this.prisma.subcategory.delete({
        where: {
          subcategory: dto.subcategory,
        },
      });

      return "all good";
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
}

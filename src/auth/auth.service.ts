import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

import * as bcrypt from "bcryptjs";
import { generateAccessToken } from "middleware/generateAccessToken";
import { LoginDto, RegisterDto } from "./auth.dto";
import verifyToken from "middleware/verifyToken";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto: LoginDto) {
    try {
      const User = await this.prisma.admin.findFirst({
        where: {
          name: dto.name,
        },
      });

      if (!User) {
        throw new NotFoundException(
          "Пользователь с данным email не существует"
        );
      }
      const validPassword = bcrypt.compareSync(dto.password, User.password);
      if (!validPassword) {
        throw new NotFoundException("не верный пароль");
      }

      const token = generateAccessToken(User.id, "1h");
      return {
        token,
      };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async register(dto: RegisterDto) {
    try {
      const existingUser = await this.prisma.admin.findFirst({
        where: {
          name: dto.name,
        },
      });

      if (existingUser) {
        throw new NotFoundException(
          "Пользователь с данным email уже существует"
        );
      }
      dto.password = await bcrypt.hash(dto.password, 7);

      const createdUser = await this.prisma.admin.create({
        data: dto,
      });
      const token = generateAccessToken(createdUser.id, "1h");
      return {
        token,
      };
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
  async checkUser(token) {
    try {
      const { user } = await verifyToken(token, this.prisma);
      if (!user) {
        throw new NotFoundException(
          "The user with the given identifier was not found."
        );
      }
      return true;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }
}

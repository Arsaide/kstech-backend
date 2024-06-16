import * as jwt from 'jsonwebtoken';

import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

async function verifyToken(
  token: string,
  prismaService: PrismaService,
): Promise<{ user: any; id: string }> {
  try {
    if (!token) {
      throw new NotFoundException('Пользователь не авторизован');
    }

    const decodedData = jwt.verify(token, process.env.SECRET) as { id: string };
    const id = decodedData.id;

    const user = await prismaService.admin.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'The user with the given identifier was not found.',
      );
    }

    return { user, id };
  } catch (error) {
    throw new NotFoundException(
      'Невозможно верифицировать токен или найти пользователя',
    );
  }
}

export default verifyToken;

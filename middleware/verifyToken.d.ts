import { PrismaService } from 'src/prisma.service';
declare function verifyToken(token: string, prismaService: PrismaService): Promise<{
    user: any;
    id: string;
}>;
export default verifyToken;

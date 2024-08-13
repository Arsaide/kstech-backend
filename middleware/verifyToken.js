"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const common_1 = require("@nestjs/common");
async function verifyToken(token, prismaService) {
    try {
        if (!token) {
            throw new common_1.NotFoundException('Пользователь не авторизован');
        }
        const decodedData = jwt.verify(token, process.env.SECRET);
        const id = decodedData.id;
        const user = await prismaService.admin.findFirst({
            where: {
                id: id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('The user with the given identifier was not found.');
        }
        return { user, id };
    }
    catch (error) {
        throw new common_1.NotFoundException('Невозможно верифицировать токен или найти пользователя');
    }
}
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map
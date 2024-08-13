"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = void 0;
const jwt = require("jsonwebtoken");
const generateAccessToken = (id, time) => {
    const playold = {
        id,
    };
    return jwt.sign(playold, process.env.SECRET, { expiresIn: time });
};
exports.generateAccessToken = generateAccessToken;
//# sourceMappingURL=generateAccessToken.js.map
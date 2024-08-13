"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = deleteFile;
exports.uploadFile = uploadFile;
const generateartcile_1 = require("./generateartcile");
require("dotenv").config();
const S3 = require("aws-sdk/clients/s3");
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new S3({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});
function deleteFile(url) {
    const parts = url.split('/');
    const name = parts[parts.length - 1];
    const params = {
        Bucket: bucketName,
        Key: name,
    };
    return s3.deleteObject(params).promise();
}
function uploadFile(file) {
    const name = (0, generateartcile_1.default)();
    console.log(file);
    const params = {
        Bucket: bucketName,
        Key: name,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    s3.upload(params).promise();
    console.log(name);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${name}`;
}
//# sourceMappingURL=saveImg.js.map
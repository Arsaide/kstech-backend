require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new S3({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});
function uploadFile(file) {
    const params = {
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    return s3.upload(params).promise();
}
exports.uploadFile = uploadFile;
function getFileStream(fileKey) {
    console.log({
        region: region,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    });
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
//# sourceMappingURL=create.js.map
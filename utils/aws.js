const fs = require("fs");
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_IAM_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET
});

// 1. Save File
exports.saveFile = (filePath, fileKey) => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Body: fs.createReadStream(filePath),
            Key: fileKey
        }, (err, data) => {
            resolve(data);
        });
    });
};

// 2. Read File
exports.readFile = (fileLink) => {
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileLink
        }, (err, data) => {
            resolve(data.Body.toString());
        });
    });
};

// 3. Delete File
exports.deleteFile = (fileKey) => {
    // console.log(fileKey);
    return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey
        }, (err, data) => {
            // console.log(err);
            resolve(data);
        });
    });
};
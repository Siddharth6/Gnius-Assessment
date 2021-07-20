const fs = require("fs");
const path = require("path");
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_IAM_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET,
    region: process.env.AWS_REGION
});

// 1. Save File
exports.saveFile = (req, res) => {
    let ext = path.extname(req.file.originalname);

    if (ext !== ".pdf") {
        return res.status(400).json({
            success: false,
            message: "File type is not supported"
        });
    }

    var params = {
        ACL: 'public-read',
        Bucket: process.env.AWS_S3_BUCKET,
        Body: fs.createReadStream(req.file.path),
        Key: `resume/${Date.now()+ '-' +req.file.originalname}`
    };

    s3.upload(params, (err, data) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: err
            });
        }
  
        if (data) {
          fs.unlinkSync(req.file.path);
          res.json({
            success: true,
            message: 'File uploaded successfully',
            link: data.Location
          });
        }
    });
};
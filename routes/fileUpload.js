const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require("path"); 
const cloudinary = require("cloudinary").v2;
const upload = require("../utils/multer");
const { saveFile } = require("../utils/aws");


// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SERCRET,
});

// Image
router.post('/', upload.single('file'), (req, res, next) => {
  // Upload image to cloudinary
  const result = cloudinary.uploader.upload(req.file.path, function(error, result) {
    res.json({
      success: true,
      message: 'File uploaded successfully',
      link: result.secure_url,
      cloudinary_id: result.public_id,
    })
  });
});

// profile picture
router.post("/profile", upload.single('file'), (req, res, next) => {
  // Upload image to cloudinary
  const result = cloudinary.uploader.upload(req.file.path, function(error, result) {
    res.json({
      success: true,
      message: 'File uploaded successfully',
      link: result.secure_url,
      cloudinary_id: result.public_id,
    })
  });
});

// Resume Upload
router.post("/resume", multer({ dest: 'resume/', limits: { fieldSize: 8 * 1024 * 1024 } }).single('file'),saveFile);

module.exports = router;
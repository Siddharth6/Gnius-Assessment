const multer = require('multer');
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");

const pipeline = promisify(require("stream").pipeline);
const upload = multer();

// Image
router.post('/', upload.single('file'), (req, res, next) => {
  const { file } = req;

  if (file.detectedFileExtension != ".jpg" && file.detectedFileExtension != ".png") {
    res.status(400).json({
      message: "Invalid format",
    });
  }
  else {
    const filename = Date.now() + '-' + file.originalName;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/uploads/${filename}`)
    );

    res.json({
      success: true,
      message: 'File uploaded successfully',
      link: `uploads/${filename}`
    });
  }
});


// Resume Upload
router.post("/resume", upload.single("file"), (req, res) => {

  const { file } = req;
  
  if (file.detectedFileExtension != ".pdf") {
    res.status(400).json({
      message: "Invalid format",
    });
  }
  else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
    );

    res.json({
      success: true,
      message: "File uploaded successfully",
      link: `resume/${filename}`
    });
    
  }
});

// profile picture
router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (
    file.detectedFileExtension != ".jpg" && file.detectedFileExtension != ".png") {
    res.status(400).json({
      message: "Invalid format",
    });
  } else {
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    pipeline(
      file.stream,
      fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
    )
    .then(() => {
      res.send({
        message: "Profile image uploaded successfully",
        url: `/host/profile/${filename}`,
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Error while uploading",
      });
    });
  }
});


module.exports = router;
const express = require("express");
const router = express.Router();

const results = require("../services/generateResults");

router.post('/results', results.generateResults);

module.exports = router;
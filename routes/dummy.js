const express = require("express");
const router = express.Router();

const {time} = require("../controllers/dummy");

router.post('/time', time);

module.exports = router;
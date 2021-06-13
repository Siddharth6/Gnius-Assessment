var express = require("express");
var router = express.Router();

var {time} = require("../services/dummy");

router.post('/time', time);

module.exports = router;
var express = require("express");
var router = express.Router();

const refer = require("../services/refer");

router.post('/add', refer.addReferrer);
router.post('/list', refer.getAllReferrer);

module.exports = router;
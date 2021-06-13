var express = require("express");
var router = express.Router();

const login = require("../services/login");

router.post('/',login.userlogin);

module.exports = router;
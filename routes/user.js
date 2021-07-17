var express = require("express");
var router = express.Router();

var userservice  = require("../services/user");
var trainer = require('../services/trainerFunctions');

router.get('/details',userservice.userdetails);
router.post('/update/password', userservice.updatePassword);

router.post('/update/details', trainer.trainerUpdate);


module.exports = router;
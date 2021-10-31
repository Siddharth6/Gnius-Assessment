const express = require("express");
const router = express.Router();

const admin = require("../controllers/adminFunctions");

//create new Trainer
router.post('/trainer/create',admin.trainerRegister);
router.get('/trainer/details/all',admin.getAllTrainers);
router.get('/trainer/details/:_id',admin.getSingleTrainer);
router.post('/trainer/remove',admin.removeTrainer);

module.exports = router;
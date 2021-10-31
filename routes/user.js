const express = require("express");
const router = express.Router();

const userservice  = require("../controllers/user");
const trainer = require('../controllers/Trainer');

router.get('/details',userservice.userdetails);
router.post('/update/password', userservice.updatePassword);
router.post('/update/details', trainer.trainerUpdate);

module.exports = router;
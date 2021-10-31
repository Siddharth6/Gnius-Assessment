const express = require("express");
const router = express.Router();

const refer = require("../controllers/refer");

router.post('/add', refer.addReferrer);
router.post('/list', refer.getAllReferrer);

module.exports = router;
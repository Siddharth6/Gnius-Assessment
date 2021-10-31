const express = require("express");
const router = express.Router();

const stats = require('../controllers/stats');

router.post('/sub', stats.getQuestionStats);
router.post('/test', stats.getTestinfo);

module.exports = router;
const express = require("express");
const router = express.Router();

var questions = require("../services/trainerFunctions");

router.post('/create',questions.createQuestion);
router.post('/details/all',questions.getAllQuestions);
router.get('/details/:_id',questions.getSingleQuestion);
router.post('/delete',questions.deleteQuestion);
router.post('/edit',questions.editQuestion);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
    createQuestion,
    createTestCase,
    getQuestionData,
    getAllQuestions,
} = require("../controllers/Coding");

const {
    fetchAllTestCases,
} = require('../controllers/Testcase');

// Create Question
router.post('/create/question', createQuestion);

// List All Questions
router.post('/list/question', getAllQuestions);

// Create test case
router.post("/create/testcase/:questionId", createTestCase);

// Create test case
router.post("/list/testcase", fetchAllTestCases);

module.exports = router;
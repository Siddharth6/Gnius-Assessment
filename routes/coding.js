const express = require("express");
const router = express.Router();

const {
    createQuestion,
    createTestCase,
    // getQuestionData,
    getAllQuestions,
    deleteTestCase,
    editQuestion
} = require("../controllers/Coding");

const {
    fetchAllTestCases,
} = require('../controllers/Testcase');

// Create Question
router.post('/create/question', createQuestion);

// Edit Question
router.post('/edit/question', editQuestion);

// List All Questions
router.post('/list/question', getAllQuestions);

// Create test case
router.post("/create/testcase/:questionId", createTestCase);

// Get All test case
router.post("/list/testcase", fetchAllTestCases);

// Delete test case
router.post("/delete/testcase/:testcaseId", deleteTestCase);

module.exports = router;
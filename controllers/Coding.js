// Coding Judge
const fm = require("formidable");
const { check, validationResult } = require("express-validator");

const {
    codingQuestion,
    codingTestCase,
    codingContest,
    codingSubmission
} = require('../models/coding');

const testcaseCtrl = require("./Testcase");
const S3 = require('../utils/aws');
const { ers, createResponseObject } = require('../middlewares');


// 1 - Create Question
exports.createQuestion = (req,res) => {
    const { title, statement, category, difficulty, timelimit, memorylimit } = req.body;

    if (!title) {
        return ers(res, 400, "Question Name is Required");
    }

    if (!memorylimit) {
        return ers(res, 400, "Memory Limit is Required");
    }

    if (!timelimit) {
        return ers(res, 400, "Time Limit is Required");
    }

    if(!statement){
        return ers(res, 400, "Problem Statement File is required")
    }

    if(!category){
        return ers(res, 400, "Category is required")
    }

    if(!difficulty){
        return ers(res, 400, "Difficulty is required")
    }

    let question = new codingQuestion({ 
        title, 
        statement, 
        category, 
        difficulty, 
        timelimit, 
        memorylimit 
    });
    
    question.user = req.user._id;

    question.save((err, question) => {
        if (err) {
            return ers(res, 400, "Failed to make a new question")
        }
        return res.status(200).json({
            success: true,
            message: 'Question Added Successfully',
            question: question
        });
    });
};

// 2 - List All Questions
exports.getAllQuestions = (req, res) => {
    codingQuestion
    .find({}, (err, questions) => {
        if (err) {
            return ers(res, 400, "Failed to make a new question")
        }

        return res.status(200).json({
            success: true,
            message: 'Questions',
            questions: questions
        });
    });
};


// 3 - Create TestCase
exports.createTestCase = (req, res) => {
    if (!req.body.hasOwnProperty('test-input')) {
        return ers(res, 400, "Both I/P and O/P files are required !")
    }

    // console.log(req.body);

    var new_test = new codingTestCase({
        question: req.params.questionId,
        input: req.body['test-input'], 
        output: req.body['test-output']
    });

    new_test
    .save((err, testcase) => {
        if (err) {
            return ers(res, 400, "Something Wrong");
        } 
        else {
            return res.status(200).json({
                success: true,
                message: 'Test Case Added Successfully',
                testcase: testcase
            });
        }
    });

};

const fm = require("formidable");
const sanitize = require("mongo-sanitize");  
const fs = require("fs");
const { check, validationResult } = require("express-validator");

const {
    codingQuestion,
    codingTestCase,
    codingContest
} = require('../models/coding');

const { ers, createResponseObject } = require('../middlewares');

// 1 - Delete Test Case
exports.deleteTestCase = (req, res) => {
    const { questionId } = req.body;

    codingTestCase.remove({ question: questionId },(err, deletedTestCase) => {
        if (err || !deletedTestCase) {
            return ers(res, 404, "Invalid Question ID")
        }

        return res.status(200).json({
            success: true,
            message: "Test Case Deleted",
        });            
    });
};

// 2 - Fetch All Test Cases and Question Details
exports.fetchAllTestCases = (req, res) => {
    req.body = sanitize(req.body);

    const { questionId } = req.body;

    codingQuestion.findById({ _id: questionId },(err, question) => {
        if (err || !question) {
            return ers(res, 404, "Invalid Question ID")
        }
        
        codingTestCase
        .find({ question: questionId },(err, testcases) => {
            if (err) {
                return ers(res, 400, "Unable to fetch TestCases");
            }

            return res.status(200).json({
                success: true,
                question: question,
                testcases: testcases
            });
        });
    });
};
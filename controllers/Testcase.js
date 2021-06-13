const fm = require("formidable");
const sanitize = require("mongo-sanitize");  
const fs = require("fs");
const { check, validationResult } = require("express-validator");

const {
    codingQuestion,
    codingTestCase,
    codingContest
} = require('../models/coding');

const S3 = require('../utils/aws');
const { ers, createResponseObject } = require('../middlewares');


// 1. Create TestCase
exports.createTestCase = (req, res) => {
    let form = new fm.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return ers(res, 400, "Something Wrong with form");
        }

        if (!file.input || !file.output) {
            return ers(res, 400, "Both I/P and O/P files are required !")
        }

        let testcase = new codingTestCase(fields);

        testcase.question = req.params.questionId;

        testcase.input = `testcases/${testcase.question}/${testcase._id}/input.txt`;
        testcase.output = `testcases/${testcase.question}/${testcase._id}/output.txt`

        if (file.input && file.output) {
            testcase.save((err, testcase) => {
                if (err || !testcase) {
                    // console.log(err);
                    return ers(res, 400, "Failed to save testcase");
                }
                S3.saveFile(file.input.path, testcase.input);
                S3.saveFile(file.output.path, testcase.output);
                res.json(testcase);
            });

        } else {
            return ers(res, 400, "Both I/P and O/P files are required !")
        }
    });
};

// 2. - Delete Test Case
exports.deleteTestCase = (questionId) => {
    codingTestCase.remove(
        { question: questionId },
        (err, deletedTestCase) => {
            S3.deleteFolder(`testcases/${questionId}/`);
        }
    );
};

// 3. - Delete One Test Case
exports.deleteOneTestCase = (req, res) => {
    codingTestCase.deleteOne(
        { _id: req.params.testcaseId },
        (err, deletedTestCase) => {
            S3.deleteFolder(`testcases/${req.params.questionId}/${req.params.testcaseId}`);
            res.json({ message: "Delted" })
        }
    );
};

// 4 - Fetch All Test Cases and Question Details
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

            let retTestCases = [];

            testcases.forEach(testcase => {
                let rettestcase = createResponseObject(testcase, [
                    'input',
                    'output',
                    'id'
                ]);

                retTestCases.push(rettestcase);
            });

            return res.status(200).json({
                success: true,
                question: question,
                testcases: retTestCases
            });
        });

    });
};

// 5 - Fetch Raw Input
exports.fetchRawInput = (req, res) => {
    codingTestCase.findOne({ _id: req.params.testcaseId },(err, testcase) => {
        if (err) {
            return ers(res, 400, "Unable to fetch testcase")
        }
        
        S3.readFile(testcase.input)
            .then(
                data => { res.json({ input: data }); }
            )
            .catch(
                err => { res.json({ error: "Unable to read file" }) }
        );        
    });
};

// 6 - Fetch Raw Output
exports.fetchRawOutput = (req, res) => {
    codingTestCase.findOne(
        { _id: req.params.testcaseId },
        (err, testcase) => {
            if (err) {
                return ers(res, 400, "Unable to fetch testcase")
            }
            S3.readFile(testcase.output)
                .then(
                    data => { res.json({ output: data }); }
                )
                .catch(
                    err => { res.json({ error: "Unable to read file" }) }
            );
        }
    );
};
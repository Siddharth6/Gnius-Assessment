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

// 2 - Update Question
exports.updateQuestion = (req, res) => {
    let form = new fm.IncomingForm();
    form.keepExtensions = true;

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return ers(res, 422, error.array()[0].msg);
    }

    form.parse(req, (err, fields, file) => {
        if (err) {
            return ers(res, 400, "Something wrong with form")
        }

        codingQuestion.findById({ _id: req.params.questionId },(err, ques) => {
            if (err || !ques) {
                return ers(res, 404, "Question Not Found")
            }

            if (fields.name)
                ques.name = fields.name;

            ques.save((err, question) => {
                if (err || !question) {
                    return ers(400, "Fail to update");
                }
                return res.json(question);
            });
        });
    });
};

// 3 - List All Questions
exports.getAllQuestions = (req, res) => {
    codingQuestion
    .find({}, (err, questions) => {
        if (err) {
            return ers(res, 400, "Failed to make a new question")
        }

        return res.status(200).json({
            success: true,
            message: 'Question Added Successfully',
            questions: questions
        });
    });
};


// 7 - Create TestCase
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
        testcase.question = req.question._id;

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

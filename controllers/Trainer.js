const sanitize = require("mongo-sanitize");

const QuestionModel = require("../models/questions");
const UserModel = require('../models/user');
const options = require("../models/option");

const tool = require("../services/tool");

// Update Trainer Details
const trainerUpdate = (req, res, next) => {
    req.body = sanitize(req.body);

    if (req.user.type === 'TRAINER') {
        req.check('avatar', `Invalid Avatar`).notEmpty();
        req.check('bio', 'Invalid About').notEmpty();
        req.check('organisation', ` Invalid Organisation`).notEmpty();
        
        var errors = req.validationErrors();

        if (errors) {
            res.status(400).json({
                success: false,
                message: 'Invalid inputs',
                errors: errors
            });
        }
        else {
            var _id = req.body._id ;
            var organisation = req.body.organisation;
            var avatar = req.body.avatar;
            var bio = req.body.bio;

            UserModel.findOneAndUpdate({_id: _id},{
                organisation: organisation,
                avatar: avatar,
                bio: bio
            })
            .then(() => {
                res.status(200).json({
                    success: true,
                    message: `Profile Updated Successfully!`
                });
            })
            .catch((err) => {
                console.log('err');

                res.status(400).json({
                    success: false,
                    message: "Unable to Update Profile"
                });
            });
        }
    }
    else {
        res.status(400).json({
            success: false,
            message: "Permissions not granted!"
        });
    }
};

// Create Question
let createQuestion = (req, res, next) => {
    req.body = sanitize(req.body);

    if (req.user.type === 'TRAINER' || req.user.type === 'ADMIN') {
        req.check('body', `Invalid question!`).notEmpty();
        req.check('subject', 'Enter subject!').notEmpty();
        var errors = req.validationErrors()
        
        if (errors) {
            res.json({
                success: false,
                message: 'Invalid inputs',
                errors: errors
            });
        }
        else {
            var body = req.body.body;
            var option = req.body.options;
            var quesimg = req.body.quesimg;
            var difficulty = req.body.difficulty;
            var subjectid = req.body.subject;
            var anscount = 0;
            var weightage = req.body.weightage;

            option.map((d, i) => {
                if (d.isAnswer) {
                    anscount = anscount + 1;
                }
            });

            // console.log(anscount);
            var explanation = req.body.explanation;

            QuestionModel.findOne({ body: body, status: 1 },
                { status: 0 })
                .then((info) => {
                    if (!info) {
                        options.insertMany(option, (err, op) => {
                            if (err) {
                                // console.log(err);
                                res.status(500).json({
                                    success: false,
                                    message: "Unable to create new question!"
                                });
                            }
                            else {
                                var ra = [];
                                // console.log(op)
                                
                                op.map((d, i) => {
                                    if (d.isAnswer) {
                                        ra.push(d._id)
                                    }
                                });

                                var tempdata = QuestionModel({
                                    body: body,
                                    explanation: explanation,
                                    quesimg: quesimg,
                                    subject: subjectid,
                                    difficulty: difficulty,
                                    options: op,
                                    createdBy: req.user._id,
                                    anscount: anscount,
                                    weightage: weightage,
                                    rightAnswers: ra
                                });

                                tempdata
                                    .save()
                                    .then(() => {
                                        res.json({
                                            success: true,
                                            message: `New question created successfully!`
                                        })
                                    })
                                    .catch((err) => {
                                        // console.log(err);
                                        res.status(500).json({
                                            success: false,
                                            message: "Unable to create new question!"
                                        });
                                    }); //...
                            }
                        })
                    }
                    else {
                        res.json({
                            success: false,
                            message: `This question already exists!`
                        })
                    }
                });
        }
    }
    else {
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    }
};


let deleteQuestion = (req, res, next) => {
    req.body = sanitize(req.body);

    if (req.user.type === 'TRAINER' || req.user.type === 'ADMIN') {
        var _id = req.body._id;
        QuestionModel.findOneAndUpdate({
            _id: _id
        },
            {
                status: 0

            }).then(() => {
                res.json({
                    success: true,
                    message: "Question has been deleted"
                })
            }).catch((err) => {
                res.status(500).json({
                    success: false,
                    message: "Unable to delete question"
                })
            })
    }
    else {
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    }
};


let getAllQuestions = (req, res, next) => {
    req.body = sanitize(req.body);

    if(req.user.type==='TRAINER' || req.user.type==='ADMIN'){
        var subject = req.body.subject;
        if(subject.length!==0){
            QuestionModel.find({subject : subject,status : 1},{status : 0})
            .populate('createdBy', 'name')
            .populate('subject', 'topic')
            .populate('options')
            .exec(function (err, question) {
                if (err){
                    // console.log(err)
                    res.status(500).json({
                        success : false,
                        message : "Unable to fetch data"
                    })
                }
                else{
                    res.json({
                        success: true,
                        message: `Success`,
                        data: question
                    });
                }
            });       
        }
        else{
            QuestionModel.find({status : 1},{status : 0})
            .populate('createdBy', 'name')
            .populate('subject', 'topic')
            .populate('options')
            .exec(function (err, question) {
                if (err){
                    // console.log(err)
                    res.status(500).json({
                        success: false,
                        message: "Unable to fetch data"
                    });
                }
                else{
                    res.json({
                        success : true,
                        message : `Success`,
                        data : question
                    })
                }
            })        
        }
    }
    else{
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    } 
};


let getSingleQuestion = (req, res, next) => {
    req.body = sanitize(req.body);
    
    if(req.user.type==='TRAINER'){
        let _id = req.params._id;
        // console.log(_id);

        QuestionModel.find({_id : _id , status : 1},{status : 0})
        .populate('questions', 'body')
        .populate('subject', 'topic')
        .populate('options')
        .exec(function (err, question) {
            if (err){
                // console.log(err)

                res.status(500).json({
                    success: false,
                    message: "Unable to fetch data"
                });
            }
            else{
                if(question.length===0){
                    res.json({
                        success: false,
                        message: `No such question exists`,
                    });
                }
                else{
                    res.json({
                        success: true,
                        message: `Success`,
                        data: question
                    });
                }   
            }
        });     
    }
    else{
        res.status(401).json({
            success : false,
            message : "Permissions not granted!"
        });
    };    
};

// Edit Question
let editQuestion = (req, res, next) => {
    req.body = sanitize(req.body);

    if (req.user.type === 'TRAINER' || req.user.type === 'ADMIN') {
        req.check('body', `Invalid question!`).notEmpty();
        req.check('subject', 'Enter subject!').notEmpty();
        var errors = req.validationErrors()
        
        if (errors) {
            res.json({
                success: false,
                message: 'Invalid inputs',
                errors: errors
            });
        }
        else {
            var _id = req.body._id;
            var body = req.body.body;
            var option = req.body.options;
            var quesimg = req.body.quesimg;
            var difficulty = req.body.difficulty;
            var subjectid = req.body.subject;
            var anscount = 0;
            var weightage = req.body.weightage;
            var explanation = req.body.explanation;

            // Counting No. of Correct Answer
            option.map((d, i) => {
                if (d.isAnswer) {
                    anscount = anscount + 1;
                }
            });

            options.insertMany(option, (err, op) => {
                if (err) {
                    // console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Unable to create new question!"
                    });
                }
                else {
                    var ra = [];
                    
                    // Pushing Options to array
                    op.map((d, i) => {
                        if (d.isAnswer) {
                            ra.push(d._id)
                        }
                    });

                    QuestionModel.findOneAndUpdate({
                        _id : _id,
                    },
                    {
                        body: body,
                        explanation: explanation,
                        quesimg: quesimg,
                        subject: subjectid,
                        difficulty: difficulty,
                        options: op,
                        createdBy: req.user._id,
                        anscount: anscount,
                        weightage: weightage,
                        rightAnswers: ra
                    },
                    {
                        new: true
                    })
                    .then((data)=>{
                        res.json({
                            success: true,
                            message :  "Question has been updated!",
                            data: data
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            success : false,
                            message : "Unable to update Question!"
                        });
                    });
                }
            });
        }
    }
    else {
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    }
};

module.exports = { 
    createQuestion, 
    getAllQuestions, 
    getSingleQuestion, 
    deleteQuestion,
    trainerUpdate,
    editQuestion
};

const Agenda = require('agenda');
const moment = require('moment');
const sanitize = require("mongo-sanitize");  
const request = require('request-promise');

const TraineeEnterModel = require("../models/trainee");
const TestPaperModel = require("../models/testpaper");
const FeedbackModel = require("../models/feedback");
const QuestionModel = require("../models/questions");
const options = require("../models/option");
const AnswersheetModel = require("../models/answersheet");
const AnswersModel = require("../models/answers");
const JobPostModel = require("../models/jobpost");
const {
    codingQuestion,
    codingTestCase,
    codingContest,
    codingSubmission
} = require('../models/coding');
const codingAnswerSheet = require('../models/codingAnswerSheet');

const sendmail = require("../services/mail");
const { assessmentLink } = require('../templates/email-templates');
const { JudgeApi } = require('../utils/url')

const { ers, createResponseObject } = require('../middlewares');

let traineeenter = (req, res, next) => {
    req.body = sanitize(req.body);

    req.check('emailid', ` Invalid email address.`).isEmail().notEmpty();
    req.check('name','This field is required.').notEmpty();
    req.check('contact','Invalid contact.').isLength({min : 13,max :13}).isNumeric({no_symbols: false});
    var errors = req.validationErrors();
    
    if(errors){
        res.json({
            success: false,
            message: 'Invalid inputs',
            errors: errors
        });
    }
    else {
        var name =  req.body.name;
        var emailid =  req.body.emailid;
        var contact =  req.body.contact;
        var organisation =  req.body.organisation;
        var testid = req.body.testid;
        var location = req.body.location;
        const start = req.body.start;
        const end = req.body.end;
        const resume = req.body.resume;

        console.log(req.body);


        TestPaperModel.findOne({ _id: testid, isRegistrationavailable: true })
            .then((info) => {
                if (info) {
                    // console.log(moment(info.start).format('MMMM Do YYYY, h:mm:ss a'));
                    
                    const schDate = moment(info.start).subtract(1, 'd').toDate(); //

                TraineeEnterModel.findOne(
                    { $or: [{ emailid: emailid, testid: testid }, { contact: contact, testid: testid }] }
                )
                .then((data) => {
                    
                    if (data) {
                        res.json({
                            success: false,
                            message: "This id has already been registered for this test!"
                        });
                    }
                    
                    else {
                        const tempdata = TraineeEnterModel({
                            name: name,
                            emailid: emailid,
                            contact: contact,
                            organisation: organisation,
                            testid: testid,
                            location: location,
                            resume: resume
                        });

                        tempdata.save().then((u) => {
                            // Agenda Js
                            const agenda = new Agenda({
                                db: { address: process.env.DATABASE, collection: 'agendaschedulejobs' },
                                processEvery: '30 seconds',
                                options: {
                                    useUnifiedTopology: true
                                }
                            });

                            agenda.define('send test link', (job) => {

                                const { to, userid, atestid, uname, tstart, tend, tduration } = job.attrs.data;
                                
                                const htmlBody = assessmentLink(
                                    uname,
                                    `${req.protocol + '://' + req.get('host')}/candidate/taketest?testid=${atestid}&traineeid=${userid}`,
                                    tstart,
                                    tend,
                                    tduration
                                );
                                
                                sendmail(to, "Assessment Link", '',htmlBody)
                                .then((dd)=>{
                                    console.log(dd)
                                })
                                .catch((errr) => {
                                    console.log(errr);
                                });
                            });

                            agenda.on('ready', function () {
                                agenda.start();
                                agenda.schedule(
                                    schDate,
                                    'send test link',
                                    {
                                        to: emailid,
                                        userid: u._id,
                                        atestid: testid,
                                        uname: name,
                                        tstart:info.start,
                                        tend:info.end,
                                        tduration:info.duration
                                    }
                                );
                            });

                            res.status(200).json({
                                success: true,
                                message: `Trainee registered successfully!`,
                                user: u
                            });
                        })
                        .catch((err) => {
                            // console.log(err);
                            res.status(500).json({
                                success: false,
                                message: "Server error!"
                            })
                        });
                    }
                });
            }
            else{
                res.status().json({
                    success: false,
                    message: ` Registration for this test has been closed!`
                });
            }
        })
        .catch((err)=>{
            //console.log(err)
            res.status(500).json({
                success: false,
                message: 'Server error!'
            });
        });
    };
};


let correctAnswers = (req, res, next) => {
    req.body = sanitize(req.body);

    var _id = req.body._id;

    TestPaperModel.find(
        { _id: _id, testconducted: true },
        { type: 0, subjects: 0, duration: 0, organisation: 0, difficulty: 0, testbegins: 0, status: 0, createdBy: 0, isRegistrationavailable: 0, testconducted: 0 }
    )
        .populate('questions', 'body')
        .populate('questions', 'explanation')
        .populate({
            path: 'questions',
            model: QuestionModel,
            select: { 'body': 1, 'quesimg': 1, 'weightage': 1, 'anscount': 1, 'explanation': 1 },
            populate: {
                path: 'options',
                model: options
            }
        })
        .exec(function (err, correctAnswers) {
            if (err) {
                // console.log(err)
                res.status(500).json({
                    success: false,
                    message: "Unable to fetch details"
                })
            }
            else {
                if (!correctAnswers) {
                    res.json({
                        success: false,
                        message: 'Invalid test id.'
                    });
                }
                else {
                    res.json({
                        success: true,
                        message: 'Success',
                        data: correctAnswers
                    });
                }
            }
        });
};

let feedback = (req, res, next) => {
    req.body = sanitize(req.body);

    var userid = req.body.userid;
    var testid = req.body.testid;
    var feedback = req.body.feedback;
    var rating = req.body.rating;
    
    var tempdata = FeedbackModel({
        feedback: feedback,
        rating: rating,
        userid: userid,
        testid: testid
    });
        
    tempdata.save().then(() => {
        res.json({
            success: true,
            message: `Feedback recorded successfully!`
        });
    }).catch((err) => {
        // console.log(err);
        res.status(500).json({
            success: false,
            message: "Error occured!"
        });
    });
};

let checkFeedback = (req, res, next) => {
    req.body = sanitize(req.body);

    var userid = req.body.userid;
    var testid = req.body.testid;

    FeedbackModel.findOne({userid:userid,testid:testid}).then((info)=>{
        if(!info){
            res.json({
                success: true,
                message: 'Feedback is not given by this userid.',
                status: false
            });
        }else{
            res.json({
                success: true,
                message: 'Feedback given',
                status: true
            });
        }
    })
    .catch((err) => {
        // console.log(err);
        res.status(500).json({
            success : false,
            message : "Error occured!"
        })
     })
}
    
let resendmail = (req, res, next) => {
    req.body = sanitize(req.body);

    var userid = req.body.id;
    
    TraineeEnterModel.findById(userid, { emailid: 1, testid: 1 }).then((info) => {
        if(info){
            // console.log(info)
            sendmail(info.emailid,"Registered Successfully",`You have been successfully registered for the test. Click on the link given to take test  "${req.protocol + '://' + req.get('host')}/trainee/taketest?testid=${info.testid}&traineeid=${info._id}"`).then((dd)=>{
                console.log(dd)
            }).catch((errr)=>{
                console.log(errr);
            })
            res.json({
                success: true,
                message: `Link sent successfully!`,

            });
        }
        else{
            res.json({
                success: false,
                message: "This user has not been registered."
            });
        }
    });
}

let Testquestions = (req, res, next) => {
    req.body = sanitize(req.body);

    var testid = req.body.id;
    
    TestPaperModel.findById(testid, { type: 0, title: 0, subjects: 0, organisation: 0, difficulty: 0, testbegins: 0, status: 0, createdBy: 0, isRegistrationavailable: 0 })
        .populate('questions', 'body')
        .populate({
            path: 'questions',
            model: QuestionModel,
            select: { 'body': 1, 'quesimg': 1, 'weightage': 1, 'anscount': 1, 'duration': 1 },
            populate: {
                path: 'options',
                select: { 'optbody': 1, 'optimg': 1 }
            }
        })
        .exec(function (err, Testquestions) {
            if (err) {
                // console.log(err)
                res.status(500).json({
                    success: false,
                    message: "Unable to fetch details"
                });
            }
            else {
                if (!Testquestions) {
                    res.json({
                        success: false,
                        message: 'Invalid test id.'
                    });
                }
                else {
                    res.json({
                        success: true,
                        message: 'Success',
                        data: Testquestions.questions
                    });
                }
            }
        });
};

let Answersheet = (req, res, next) => {
    req.body = sanitize(req.body);

    var userid = req.body.userid;
    var testid = req.body.testid;

    var p1= TraineeEnterModel.find({_id:userid,testid:testid});
    var p2 = TestPaperModel.find({_id:testid,testbegins : true, testconducted : false});
    
    Promise.all([p1,p2]).then((info)=>{
        if(info[0].length && info[1].length){
            AnswersheetModel.find({userid:userid,testid:testid}).then((data)=>{
                if(data.length){
                    res.json({
                        success : true,
                        message : 'Answer Sheet already exists!',
                        data : data
                    })
                }
                else{ 
                    var qus = info[1][0].questions;
                    var answer = qus.map((d,i)=>{
                        return({
                            questionid:d,
                            chosenOption:[],
                            userid:userid
                        })
                    })
                    AnswersModel.insertMany(answer,(err,ans)=>{
                        if(err){
                            // console.log(err);
                            res.status(500).json({
                                success : false,
                                message : "Unable to create Answersheet!"
                            })
                        }else{
                            var startTime = new Date();
                            var tempdata = AnswersheetModel({
                                startTime:startTime,
                                questions : qus,
                                answers:ans,
                                testid:testid,
                                userid:userid
                            })
                            tempdata.save().then((Answersheet)=>{
                                res.json({
                                    success : true,
                                    message : 'Test has started!'
                                })

                            }).catch((error)=>{
                                res.status(500).json({
                                    success : false,
                                    message : "Unable to fetch details"
                                })
                            })
                        }
                    })
                }
            })
        }
        else{
            res.json({
                success: false,
                message: 'Invalid URL'
            });
        }
    })
    .catch((err) => {
        // console.log(err)
        res.status(500).json({
            success: false,
            message: "Unable to fetch details"
        });
    });
};

// Start Test Controller
let flags = (req, res, next) => {
    req.body = sanitize(req.body);

    var testid = req.body.testid;
    var traineeid = req.body.traineeid;

    const p1 = AnswersheetModel.findOne({
        userid : traineeid,
        testid : testid},
        {_id : 1,startTime  :1,completed : 1}
    );

    const p2 = TraineeEnterModel.findOne({_id : traineeid , testid : testid},{_id : 1});
    const p3 = TestPaperModel.findById(testid,{
        testbegins : 1, 
        testconducted : 1, 
        duration : 1,
        addjobpost: 1,
        addcoding: 1,
    });

    var present = new Date();

    Promise.all([p1, p2, p3]).then((info) => {
        // console.log(info)
        
        if (info[1] === null) {
            res.status(400).json({
                success: false,
                message: 'Invalid URL!'
            });
        } else {
            
            var startedWriting = false;
            var pending = null;

            if (info[0] !== null) {
                startedWriting = true;

                pending = info[2].duration * 60 - ((present - info[0].startTime) / (1000));

                if (pending <= 0) {
                    AnswersheetModel.findOneAndUpdate({ 
                        userid: traineeid, testid: testid }, { completed: true }
                    )
                    .then((result) => {
                        res.json({
                            success: true,
                            message: 'Successfull',
                            data: {
                                testbegins: info[2].testbegins,
                                testconducted: info[2].testconducted,
                                startedWriting: startedWriting,
                                addjobpost: info[2].addjobpost,
                                addcoding: info[2].addcoding,
                                pending: pending,
                                completed: true
                            }
                        })
                    })
                    .catch((error) => {
                        res.status(500).json({
                            success: false,
                            message: "Unable to fetch details"
                        })
                    })
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Successfull',
                        data: {
                            testbegins: info[2].testbegins,
                            testconducted: info[2].testconducted,
                            startedWriting: startedWriting,
                            pending: pending,
                            addjobpost: info[2].addjobpost,
                            addcoding: info[2].addcoding,
                            completed: info[0].completed
                        }
                    });
                }
            }
            else {
                res.json({
                    success: true,
                    message: 'Successfull',
                    data: {
                        testbegins: info[2].testbegins,
                        testconducted: info[2].testconducted,
                        startedWriting: startedWriting,
                        addjobpost: info[2].addjobpost,
                        addcoding: info[2].addcoding,
                        pending: pending,
                        completed: false
                    }
                });
            }
        }
    }).catch((error) => {
        // console.log(error)
        res.status(500).json({
            success: false,
            message: "Unable to fetch details"
        });
    });
};

let TraineeDetails = (req, res, next) => {
    req.body = sanitize(req.body);

    var traineeid = req.body._id;

    TraineeEnterModel.findById(traineeid, { name: 1, emailid: 1, contact: 1 }).then((info) => {
        if (info) {
            res.json({
                success: true,
                message: 'Trainee details',
                data: info
            });
        } else {
            res.json({
                success: false,
                message: 'This trainee does not exists'
            });
        }
    }).catch((error) => {
        res.status(500).json({
            success: false,
            message: "Unable to fetch details"
        });
    });
};

let chosenOptions = (req, res, next) => {
    req.body = sanitize(req.body);

    var testid = req.body.testid;
    var userid = req.body.userid;
    AnswersheetModel.findOne({ testid: testid, userid: userid }, { answers: 1 })
        .populate('answers')
        .exec(function (err, answersheet) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Answersheet does not exist'
                })
            
            } else {
                res.json({
                    success: true,
                    message: 'Chosen Options',
                    data: answersheet
                })
            }
        });
};

let UpdateAnswers = (req, res, next) => {
    req.body = sanitize(req.body);

    var testid = req.body.testid;
    var userid = req.body.userid;
    var questionid = req.body.qid;
    var newAnswer = req.body.newAnswer;

    const p1 = TestPaperModel.findById(testid, { duration: 1 });
    const p2 = AnswersheetModel.findOne({ testid: testid, userid: userid, completed: false }, { _id: 1, startTime: 1 });
    
    var present = new Date();
    Promise.all([p1, p2])
        .then((info) => {
            if (info[1]) {
                var pending = null;
                pending = info[0].duration * 60 - ((present - info[1].startTime) / (1000))
                if (pending > 0) {
                    AnswersModel.findOneAndUpdate({ questionid: questionid, userid: userid }, { chosenOption: newAnswer }).then((info) => {
                        // console.log(info)
                        if (info) {
                            res.json({
                                success: true,
                                message: 'Answer Updated',
                                data: info
                            })
                        } else {
                            res.json({
                                success: false,
                                message: 'Question is required!'
                            })
                        }
                   
                    }).catch((error) => {
                        // console.log(error)
                        res.status(500).json({
                            success: false,
                            message: "Error occured!"
                        });
                    })
                } else {
                    AnswersheetModel.findByIdAndUpdate({ testid: testid, userid: userid }, { completed: true }).then(() => {
                        res.json({
                            success: false,
                            message: 'Time is up!'
                        });
                    }).catch((error) => {
                        res.status(500).json({
                            success: false,
                            message: "Error occured!"
                        });
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: 'Unable to update answer'
                })
            }
        }).catch((error) => {
            res.status(500).json({
                success: false,
                message: "Error occured!"
            })
        });
};

let EndTest = (req, res, next) => {
    req.body = sanitize(req.body);

    var testid = req.body.testid;
    var userid = req.body.userid;

    AnswersheetModel.findOneAndUpdate({testid:testid,userid:userid},{completed : true}).then((info)=>{
        if(info){
            res.json({
                success : true,
                message : 'Your answers have been submitted'
            })
        }else{
            res.json({
                success : false,
                message : 'Unable to submit answers!'
            })
        }
    }).catch((error)=>{
        res.status(500).json({
            success: false,
            message: "Error occured!"
        });
    });
};
 
let getQuestion = (req, res, next) => {
    req.body = sanitize(req.body);
    
    let qid = req.body.qid;
        
    QuestionModel.find({_id : qid , status : 1},{body : 1, options : 1,quesimg : 1})
        .populate({ 
            path: 'options',
            model: options,
            select : {'optbody' : 1,'optimg' : 1}
        })
        .exec(function (err, question) {
            if (err){
                // console.log(err)
                res.status(500).json({
                    success : false,
                    message : "Unable to fetch data"
                });
            }
            else{
                if(question.length===0){
                    res.json({
                        success : false,
                        message : `No such question exists`,
                    });
                }
                else{
                    res.json({
                        success : true,
                        message : `Success`,
                        data : question
                    });
                }   
            }
        });        
};


// GET Single Job Post
const getSingleJobPost = (req, res, next) => {
    req.body = sanitize(req.body);

    const { testid } = req.body;

    JobPostModel
    .findOne({testid:testid})
    .populate('postedBy')
    .exec((err,job) => {
        if(err){
            res.status(500).json({
                success : false,
                message : err
            });
        }
        else{
            if(!job){
                return res.status(404).json({
                    success: false,
                    message: 'No Job Post Found'
                });
            }
            else{
                return res.status(200).json({
                    success: true,
                    message: 'Job Post Found',
                    job: job
                });
            }
        }
    });
};

/*
------------
   Coding
------------
*/

// Get Coding Question Data with Test Cases
const getQuestionData = (req, res, next) => {
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


// Fetch All TestCases And Question about
const fetchAllTestCases = (req, res) => {
    codingTestCase.find({ question: req.params.questionId },(err, testcases) => {
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
            
        let quesData = createResponseObject(req.question, [
            'id',
            'name'
        ]);

        return res.status(200).json({ 
            testcases: retTestCases, 
            question: quesData 
        });
    });
};


// Fetch Raw Input
const fetchRawInput = (req, res) => {
    codingTestCase.findOne({ _id: req.params.testcaseId },(err, testcase) => {
        if (err) {
            return ers(res, 400, "Unable to fetch testcase")
        }

        S3.readFile(testcase.input)
        .then(data => { res.json({ input: data }); })
        .catch(err => { res.json({ error: "Unable to read file" }) });
    });
};

// Fetch Raw Output
const fetchRawOutput = (req, res) => {
    codingTestCase.findOne({ _id: req.params.testcaseId },(err, testcase) => {
        if (err) {
            return ers(res, 400, "Unable to fetch testcase")
        }

        S3
        .readFile(testcase.output)
        .then(data => { res.json({ output: data }); })
        .catch(err => { res.json({ error: "Unable to read file" }) });
    });
};


// Get Contest Questions
const getContestQuestion = (req, res) => {
    req.body = sanitize(req.body);

    const { testId } = req.body;

    codingContest
    .findOne({testid: testId})
    .populate('questions')
    .exec((err, contest) => {
        if (err || !contest) {
            return ers(res, 404, "Contest Not Found");
        }

        return res.status(200).json({
            "success": true,
            "questions": contest.questions, 
            "time": contest.time
        });
    });
};


// Post New Submission
const postSubmission = (req, res, next) => {
    req.body = sanitize(req.body);

    const { 
        testId,
        traineeId,
        que_id,
        source_code,
        language_id,
    } = req.body;

    codingQuestion
    .findById(que_id)
    .exec((err, result) => {
        codingTestCase
        .find({question: que_id})
        .exec((err, testcase) => {

            // Get Result
            var get_result = function(data, sourcecode, submission_id) {
                var result = [], score = 0, time_avg = 0, mem_avg = 0;
                
                for (var i=0;i<data.length;i++) {
                    time_avg += parseFloat(data[i].time);
                    mem_avg += data[i].memory;
                    if (data[i].status.id === 3) {
                        result.push('Passed');
                        score++;
                    }
                    else if (data[i].status.id === 4 || data[i].status.id === 13) result.push('Wrong');
                    else if (data[i].status.id === 5) result.push('T');
                    else if (data[i].status.id === 6) {
                        result.push('Compilation Error');
                        break;
                    } 
                    else result.push('X');
                }

                const submission_result = {
                    str: result, 
                    time: time_avg/data.length, 
                    memory: mem_avg/data.length
                };

                codingSubmission
                .updateOne({ _id: submission_id },{ in_queue: false, result: submission_result }, 
                    (err, data) => {
                    if (err) console.log(err);

                    return res.status(200).json({
                        "success": true,
                        "points": score,
                        "score": result,
                    });
                });
            };

            // Main ...

            let options = [];
            
            for(var i=0;i < testcase.length; i++) {
                options.push({
                    method: 'POST',
                    uri: `${JudgeApi}/submissions/?base64_encoded=false`,
                    body: {
                        "source_code": source_code,
                        "language_id": parseInt(language_id),
                        "stdin": testcase[i].input,
                        "expected_output": testcase[i].output,
                        "cpu_time_limit": result.timelimit,
                        "memory_limit": result.memorylimit*1000
                    },
                    json: true
                });
            }


            var new_submission = new codingSubmission({
                testid: testId,
                lang: language_id,
                user: traineeId,
                sourcecode: source_code,
                submit_time: new Date(),
                question: que_id,
                in_queue: true
            });

            new_submission.save(function(err, submission) {
                if (err) console.log(err);

                const getTokens = options.map(opt => request(opt).then(res => res.token));
                
                Promise.all(getTokens).then(tokens => {
                    setTimeout(() => {
                        Promise.all(tokens.map(token => request(`${JudgeApi}/submissions/${token}`)
                        .then(res => JSON.parse(res))))
                        .then(data => {
                            get_result(data, source_code, submission.id)
                        })
                    }, 10000);
                });
            });
        });
    });
};


// Submit Coding Section
const submitCoding = (req, res) => {
    req.body = sanitize(req.body);

    const { testId, traineeId } = req.body;

    // console.log(req.body);

    var new_submission = new codingAnswerSheet({
        testid: testId,
        userid: traineeId
    });

    new_submission.save((err, submission) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err
            });
        }

        return res.status(200).json({
            success: true,
            data: submission
        });
    });
};

// Get Contest Questions
const getsubmitCoding = (req, res) => {
    req.body = sanitize(req.body);

    const { testId, traineeId } = req.body;

    codingAnswerSheet
    .findOne({testid: testId, userid: traineeId })
    .exec((err, details) => {
        if (err || !details) {
            return res.status(400).json({
                success: false,
                message: true
            });
        }

        return res.status(200).json({
            success: false,
            message: false
        });
    });
};

module.exports = {
    traineeenter,
    feedback,
    checkFeedback,
    resendmail,
    correctAnswers,
    Answersheet,
    flags,
    chosenOptions,
    TraineeDetails,
    Testquestions,
    UpdateAnswers,
    EndTest,
    getQuestion,
    getSingleJobPost,
    getQuestionData,
    fetchAllTestCases,
    fetchRawInput,
    fetchRawOutput,
    getContestQuestion,
    postSubmission,
    submitCoding,
    getsubmitCoding
};
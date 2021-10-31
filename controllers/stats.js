const sanitize = require("mongo-sanitize");

let SubjectModel = require("../models/subject");
let QuestionModel = require("../models/questions");
let TestPaperModel = require('../models/testpaper');
let TraineeEnter = require('../models/trainee');

// Get Question Stats
let getQuestionStats = (req, res) => {
    QuestionModel
    .aggregate([ 
    {
        $group: { _id: "$subject", cnt: {$sum: 1} } 
    } ])
    .exec((err,data) => {
        SubjectModel
        .populate(data, {path: '_id', select: 'topic pic'}, function(err, results) {
            if (err){
                res.status(400).json({
                    success: false,
                    message: "Unable to fetch details"
                });
            }

            res.json({
                success: true,
                data: results
            });
        });
    });
};

// Get Candidates by Each Exam
let getTestinfo = (req, res) => {
    req.body = sanitize(req.body);

    if (req.user.type === 'TRAINER') {
        TraineeEnter
        .aggregate([
            {
                $group: { _id: "$testid", cnt: {$sum: 1} } 
            },
        ])
        .exec((err,data) => {
            TestPaperModel
            .find({ createdBy: req.user._id, status: 1 })
            .exec(function (err, testpaper) {
                let stat = [];
                let total = 0;

                testpaper.forEach(test => {
                    data.forEach(dt => {
                        if( dt._id.equals(test._id) ){
                            stat.push({
                                id: dt._id,
                                title: test.title,
                                cnt: dt.cnt
                            });
                            total = total + dt.cnt;
                        }
                    });
                });

                return res.json({
                    success: true,
                    total: total,
                    data: stat
                });
                
            });
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: "Permissions not granted!"
        });
    }
};


module.exports = {
    getQuestionStats,
    getTestinfo
};
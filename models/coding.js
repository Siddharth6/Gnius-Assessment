// Coding Model
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

// 1 - Coding Question Schema
const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    statement: {
        type: String,
        required: true
    },
    memorylimit: {
        type: Number,
        required: true,
        trim: true
    },
    timelimit: {
        type: Number,
        required: true,
        trim: true
    },
    type: {
        type: String,
        default: '2'
    },
    testcase: {
        type: Array,
        default: []
    },
    sampletestcase: {
        type: Array,
        default: []
    },
    user: {
        type: ObjectId,
        ref: "UserModel",
        required: true
    },
    difficulty: String,
    category: String

}, { timestamps: true });

const codingQuestion = mongoose.model("codingQuestion", questionSchema);

// 2 - Coding TestCase Schema
const testcaseSchema = mongoose.Schema({
    input:  String,
    output: String,
    question: {
        type: ObjectId,
        ref: "codingQuestion",
        required: true,
    }
});

const codingTestCase = mongoose.model("codingTestCase", testcaseSchema);

// 3 - Coding Contest Schema
const contestSchema = new mongoose.Schema({
    testid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestPaperModel',
    },
    name: {
        type: String,
        trim: true,
    },
    starttime: {
        type: Number,
        trim: true,
    },
    endtime: {
        type: Number,
        trim: true,
    },
    time: {
        type: Number,
        default: 60
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'codingQuestion'
    }],
    organiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});

contestSchema.virtual("numberOfTasks")
    .get(function () {
        return this.questions.length;
});

contestSchema.methods = {
    isContestStarted: function () {
        let now = new Date();
        now = now.getTime();
        if (now >= this.starttime) {
            return true;
        } else {
            return false;
        }
    }
};

const codingContest = mongoose.model("codingContest", contestSchema);

// 4 - Submission Schema
const submissionSchema = new mongoose.Schema({
    question: {
        type: ObjectId,
        ref: "codingQuestion",
    },
    user: {
        type: ObjectId,
        ref: "TraineeEnterModel",
    },
    verdict: {
        type: String,
        default: "WJ"
    },
    testid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestPaperModel',
    },
    lang: String,
    sourcecode: String,
    submit_time: Date,
    time: Number,
    memory: Number,
    result: {str: Array, time: Number, memory: Number},
    in_queue: Boolean
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

const codingSubmission = mongoose.model("codingSubmission", submissionSchema);

module.exports = {
    codingQuestion,
    codingTestCase,
    codingContest,
    codingSubmission
};
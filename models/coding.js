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
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
    question: {
        type: ObjectId,
        ref: "Question",
        required: true,
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});

const codingTestCase = mongoose.model("codingTestCase", testcaseSchema);

// 3 - Coding Contest Schema
const contestSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    starttime: {
        type: Number,
        trim: true,
        required: true
    },
    endtime: {
        type: Number,
        trim: true,
        required: true
    },
    questions: {
        type: Array,
        default: []
    },
    organiser: {
        type: Array,
        default: []
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
    language: {
        type: String,
        required: true
    },
    question: {
        type: ObjectId,
        ref: "Question",
        required: true,
    },
    user: {
        type: ObjectId,
        ref: "UserModel",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    submittime: {
        type: Number,
        required: true
    },
    verdict: {
        type: String,
        default: "WJ"
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

submissionSchema.virtual("submission")
    .get(function () { return `submissions/${this.user}/${this.question}/${this._id}.code`; }
);

const codingSubmission = mongoose.model("codingSubmission", submissionSchema);


module.exports = {
    codingQuestion,
    codingTestCase,
    codingContest,
    codingSubmission
};
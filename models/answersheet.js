const mongoose = require("mongoose");

const answersheetschema = new mongoose.Schema({
    startTime: {
        type: Number,
        required: true
    },
    testid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestPaperModel',
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TraineeEnterModel',
        required: true
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionModel',
            required: true
        }
    ],
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AnswersModel',
            required: true
        }
    ],
    completed: {
        type: Boolean,
        default: false,
        required: true
    }
});

const AnswersheetModel = mongoose.model('AnswersheetModel',answersheetschema);
module.exports = AnswersheetModel;
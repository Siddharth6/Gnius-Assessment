var mongoose = require("mongoose");

var subResultsSchema = new mongoose.Schema({
    qid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionModel',
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: Array,
        required: true
    },
    givenAnswer: {
        type: Array,
        required: true
    },
    weightage: {
        type: Number,
        required: true
    },
    iscorrect: {
        type: Boolean
    }
});

var subResultsModel = mongoose.model('subResultsModel',subResultsSchema);
module.exports  = subResultsModel;
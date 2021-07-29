const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const codingAnswerSchema = new mongoose.Schema({
    testid: {
        type: ObjectId,
        ref: 'TestPaperModel',
        required: true
    },
    userid: {
        type: ObjectId,
        ref: 'TraineeEnterModel',
        required: true
    },
    completed: {
        type: Boolean
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    submitTime: {
        type: Date
    },
});

const codingAnswerSheet = mongoose.model("codingAnswerSheet", codingAnswerSchema);
module.exports = codingAnswerSheet;
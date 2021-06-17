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
        type: Boolean,
        default: true
    },
    submitTime: {
        type: Date,
        default: Date.now
    },
});

const codingAnswerSheet = mongoose.model("codingAnswerSheet", codingAnswerSchema);
module.exports = codingAnswerSheet;
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    questionid : {
        type : String,
        required : true
    },
    chosenOption : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'options',
            required : false
        }
    ],
    userid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'TraineeEnterModel',
        required : false
    }
});

const AnswersModel = mongoose.model('AnswersModel', answerSchema);
module.exports = AnswersModel;
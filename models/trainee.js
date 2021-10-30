const mongoose = require("mongoose");

const traineeschema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    emailid:{
        type : String,
        required: true
    },
    contact : {
        type : Number,
        required : true
    },
    organisation : {
        type : String,
        required : false
    },
    testid : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestPaperModel',
        required : true
    },
    location : {
        type : String,
        required : false
    },
    resume: String,
    custom: Map,
    refer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReferModel',
        default: '60e2a3c2e38d6b302c63f49d'
    },
});

const TraineeEnterModel = mongoose.model('TraineeEnterModel',traineeschema);
module.exports = TraineeEnterModel;
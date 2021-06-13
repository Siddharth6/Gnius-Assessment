var mongoose = require("mongoose");
var traineeschema = new mongoose.Schema({
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
    }
})

module.exports  = traineeschema;
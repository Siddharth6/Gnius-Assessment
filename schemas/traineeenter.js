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
    },
    resume: String,
    custom: Map,
    refer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReferModel',
        default: '60d416cc9ae89a5cca5d3a42'
    },
});

module.exports  = traineeschema;
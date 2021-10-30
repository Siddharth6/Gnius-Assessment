const mongoose = require("mongoose");

var optionschema = new mongoose.Schema({
    optbody: {
        required: false,
        type: String
    },
    optimg: {
        type: String,
        required: false,
        default: null
    },
    isAnswer: {
        type: Boolean,
        required: true,
        default: false
    }
});

const options = mongoose.model('Options', optionschema);
module.exports = options;

const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
    testid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TestPaperModel',
    },
    jobtitle: {
        type: String,
        required: true,
    },
    jobdescription: {
        type: String,
        required: true,
    },
    joblocation: {
        type: String,
        required: true,
    },
    jobtype: {
        type: String,
        required: true,
    },
    skillsets: [String],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    jobcustom: {
		type: Map
    },
    premium: {
        type: Boolean,
        default: false
    },
    dateOfPosting: {
        type: Date,
        default: Date.now,
    },
});

module.exports =  jobPostSchema;
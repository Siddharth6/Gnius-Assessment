const mongoose = require("mongoose");
const jobpostschema = require("../schemas/jobpost");

const JobPostModel = mongoose.model('JobPostModel',jobpostschema);

module.exports = JobPostModel;
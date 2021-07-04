const mongoose = require("mongoose");
const referSchema = require("../schemas/refer");

const ReferModel = mongoose.model('ReferModel', referSchema);
module.exports = ReferModel;
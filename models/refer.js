const mongoose = require("mongoose");

var referschema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    status: {
        required: true,
        default: 1,
        type: Boolean
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
}, {
    timestamps: {}
});

const ReferModel = mongoose.model('ReferModel', referschema);
module.exports = ReferModel;
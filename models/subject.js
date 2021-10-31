var mongoose = require("mongoose");

var subjectschema = new mongoose.Schema({
    topic : {
        required : true,
        type : String
    },
    status:{
        type: String,
        default: "https://localhost/ink-quill_vvjno3.png"
        // Replace With your own image details
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    status:{
        type: Boolean,
        default : 1,
        required : true
    }
},{ 
    timestamps: {}
});

var SubjectModel = mongoose.model(`SubjectModel`,subjectschema);
module.exports=SubjectModel;
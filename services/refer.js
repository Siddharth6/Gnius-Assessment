const sanitize = require("mongo-sanitize");

let ReferModel = require("../models/refer");

let addReferrer = (req, res) => {
    req.body = sanitize(req.body);

    req.check('email', 'Invalid email address').isEmail().notEmpty();
    req.check('name',  'This field is required.').notEmpty();

    var errors = req.validationErrors();
    
    if(errors){
        res.json({
            success: false,
            message: 'Invalid inputs',
            errors: errors
        });
    }
    else {
        const { name, email} =  req.body;

        ReferModel
        .findOne({ email: email })
        .then((data) => {
            if (data) {
                res.json({
                    success: false,
                    message: "This Referrer has already been added!"
                });
            }
            else {
                const tempdata = ReferModel({
                    name: name,
                    email: email,
                    createdBy: req.user._id,
                });

                tempdata
                .save()
                .then((u) => {
                    res.status(200).json({
                        success: true,
                        message: `Referrer added successfully!`,
                        refer: u
                    });
                })
                .catch((err) => {
                    // console.log(err);
                    res.status(500).json({
                        success: false,
                        message: "Server error!"
                    })
                });
            }
        })
        .catch((err)=>{
            res.status(500).json({
                success: false,
                message: 'Server error!'
            });
        });
    }
};


let getAllReferrer = (req,res) => {
    ReferModel
    .find({ createdBy: req.user._id})
    .exec(function (err, refer) {
        if (err) {
            res.status(500).json({
                success: false,
                message: "Unable to fetch data"
            });
        }
        else {
            res.json({
                success: true,
                message: `Success`,
                data: refer
            });
        }
    });
};

module.exports = {
    addReferrer,
    getAllReferrer
};
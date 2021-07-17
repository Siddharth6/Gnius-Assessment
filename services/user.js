const bcrypt = require('bcryptjs');
const User = require('../models/user');

let userdetails = (req, res, next) => {
    res.json({
        success: true,
        message: 'successfull',
        user: {
            name: req.user.name,
            type: req.user.type,
            _id: req.user._id,
            emailid: req.user.emailid,
            contact: req.user.contact,
            organisation: req.user.organisation,
            avatar: req.user.avatar,
            bio: req.user.bio,
        }
    });
};

// Update password
let updatePassword = (req, res, next) => {
    User
    .findById(req.user._id)
    .then((user) => {
        // Compare Password
        bcrypt.compare(req.body.currentPassword, user.password).then((matched) => {
            if (!matched) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Password is incorrect' 
                });
            }
            else{
                bcrypt.hash(req.body.newPassword, 10)
                .then((hash) => {
                    user.password = hash;

                    // Save the new password
                    user
                    .save()
                    .then((data)=> {
                        res.status(200).json({
                            success: true,
                            message: 'Password Updated'
                        });
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => {
                    console.log("err2",err)
                });
            }
        });
    });
};

module.exports = { 
    userdetails,
    updatePassword
};
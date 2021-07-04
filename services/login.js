let UserModel = require("../models/user");
var passport = require("../services/passportconf");
var jwt = require('jsonwebtoken');
var config = require('config');

let userlogin = (req, res, next) => {

    req.check('emailid', ` Invalid email address`).isEmail().notEmpty();
    req.check('password','Invalid password').isLength({min : 8});
    var errors = req.validationErrors();
    
    if(errors){
        res.json({
            success: false,
            message: errors,
            errors: errors
        });
    }
    else{
        passport.authenticate('login',{session:false},(err,user,info)=>{
            if(err || !user){
               res.json(info);
            }
            else{
                req.login({_id:user._id}, {session: false}, (err) => {
                    if (err) {
                        res.status(400).json({
                            success: false,
                            message: err
                        });
                    }

                    UserModel.login(user._id, function(err, user) {
                        if(err) return done(err, null);
                        done(err, user);
                    });
        
                    const token = jwt.sign({_id:user._id},config.get('jwt.secret'),{expiresIn: 5000000});

                    res.status(200).json({
                        success: true,
                        message: "login successfull",
                        user: {
                            name : user.name,
                            type: user.type,
                            _id : user._id,
                            emailid : user.emailid,
                            contact: user.contact,
                            status: user.status,
                            organisation: user.organisation,
                            avatar: user.avatar,
                            bio: user.bio
                        },
                        token: token
                    });
                });
            }
        })(req,res,next);     
    };      
};
     
module.exports = {
    userlogin
};


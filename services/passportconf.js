const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const config = require("config");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel =  require("../models/user");

//user login local strategy
passport.use('login',new LocalStrategy({
  usernameField: 'emailid',
  passwordField : 'password',
  passReqToCallback : true 
  },
  function(req,emailid, password, done) {
    UserModel.findOne({ 'emailid' : emailid, 'status' : true }, function (err, user) {
      if (err) {
          return done(err,false,{
              success: false,
              message: "Server Error"
          }); 
      }
      if (!user) {
          return done(null, false,{
              success: false,
              message: "Invalid emailid"
          });
      }
      else{
        bcrypt.compare(password, user.password)
          .then(function (res) {
            if(res){
              return done(null, user,{
                success: true,
                message: "logged in successfully"
              });
            }
            else{
              return done(null, false,{
                success: false,
                message: "Invalid Password"
              });
            }
          });
        }
    });
  }
));


//options jwt
var opts = {};

//opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('Token');
opts.secretOrKey = process.env.JWT_SECRET

passport.use('user-token',new JwtStrategy(opts, function(jwt_payload, done) {
  UserModel.findById(jwt_payload._id, function(err, user) {
        if (err) {
            return done(err, false,{
                success: false,
                message: "Server Error"
            }); 
        }
        if (user) {
            return done(null, user,{
                success: true,
                message: "Successfull"
            }); 
        } else {
            return done(null, false,{
                success: false,
                message: "Authentication Failed"
            });
        }
    });
}));


module.exports = passport
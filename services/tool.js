var UserModel = require("../models/user");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// create admin
var createadmin = () => {
    bcrypt
    .hash("<Enter Admin Password>", saltRounds)
    .then((hash)=>{
        var tempdata = new UserModel({
            name: '<Enter Admin Name>',
            password: hash,
            emailid: '<Enter Admin Email>',
            contact: '<Enter Admin Contact No.>',
            type: 'ADMIN',
        });

        tempdata.save().then(() => console.log("user created")).catch((err) => console.log("Error Creating Admin", err));
    })
    .catch((err) => {
        console.log("err",err)
    });
};

var hashPassword = (password) => {
    return (new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds).then(function (hash) {
            resolve(hash);
        }).catch((err) => {
            reject(err);
        })
    }))
};

module.exports = {
    createadmin,
    hashPassword
};
var UserModel = require("../models/user");
const bcrypt = require('bcryptjs');
const saltRounds = 10;


//create admin
var createadmin = () => {
    bcrypt.hash("gnmaster345@#fv", saltRounds).then((hash)=>{
        var tempdata = new UserModel({
            name: 'master',
            password: hash,
            emailid: 'admas@genmail.com',
            contact: '9563152391',
            type: 'ADMIN',
        });

        tempdata
            .save()
            .then(() => {
                console.log("user created")
            })
            .catch((err) => {
                console.log("err1", err);
            });
    })
    .catch((err) => {
        console.log("err2",err)
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
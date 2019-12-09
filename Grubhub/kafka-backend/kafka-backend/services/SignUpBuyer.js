var db = require('../models/schema');
var buyerModel = db.buyerModel;
// var mongoose = require('mongoose');

function handle_request(msg, callback) {
    buyerModel.find({ email: msg.email }, function (err, results) {
        if (results.length > 0) {
            console.log("email id exists");
            callback(err, "Email Id already exists!");

        }
    });
    console.log("msg----", msg)
    var insertSignUp = new buyerModel({
        firstName: msg.firstName,
        lastName: msg.lastName,
        email: msg.email,
        password: msg.hash
    })
    insertSignUp.save(function (error, results) {
        if (error) {
            console.log("error in results ", error);
            callback(error, "Error")
        }
        else {
            console.log(results);
            // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
            callback(null, results);
        };
    });

};
exports.handle_request = handle_request;
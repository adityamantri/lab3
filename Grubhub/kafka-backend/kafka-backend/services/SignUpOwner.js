var db = require('../models/schema');
var restownerModel = db.restownerModel;
// var mongoose = require('mongoose');

function handle_request(msg, callback) {
    restownerModel.find({ owner_email: msg.owner_email }, function (err, results) {
        if (results.length > 0) {
            console.log("email id exists");
            // res.cookie('cookie', "error", { maxAge: 900000, httpOnly: false, path: '/' });
            callback(err, "Email Id already exists!");
        }
    });
    var insertSignUp = new restownerModel({
        owner_firstName: msg.owner_firstName,
        owner_lastName: msg.owner_lastName,
        owner_password: msg.hash,
        cuisine: msg.cuisine,
        restaurantName: msg.restaurantName,
        zipCode: msg.zipCode,
        owner_phone: msg.owner_phone,
        owner_email: msg.owner_email
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
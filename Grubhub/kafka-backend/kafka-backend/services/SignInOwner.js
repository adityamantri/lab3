var db = require('../models/schema');
var restownerModel = db.restownerModel;
const bcrypt = require('bcrypt');

// var mongoose = require('mongoose');

function handle_request(msg, callback) {
    restownerModel.find({ owner_email: msg.owner_email }, function (error, results) {
        if (error) {
            console.log("error in results --------", results);
            throw error;
        }
        else if (results.length == 0) {
            output = { ownerError: "Incorrect userId" };
            callback(null,output);
        } else {

            bcrypt.compare(msg.owner_password, results[0].owner_password, function (err, result) {
                if (!result) {
                    console.log("error in results ", error);
                    callback(err, "Error")
                }
                else {
                    console.log(results);
                    // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
                    callback(null, results);
                };
            });

        };
    });
}
exports.handle_request = handle_request;
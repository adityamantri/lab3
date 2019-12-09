var db = require('../models/schema');
var sectionModel = db.restownerModel;
var mongoose = require('mongoose');

function handle_request(msg, callback) {
           sectionModel.find({ _id:msg.restaurantId}, function (error, results) {

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
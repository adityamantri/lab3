var db = require('../models/schema');
var buyerModel = db.buyerModel;
var mongoose = require('mongoose');

function handle_request(msg, callback) {
    buyerModel.updateOne({ _id: msg.buyerId },
        {
            $set: {
                firstName: msg.firstName,
                lastName: msg.lastName,
                phone: msg.phone,
                address: msg.address
            }
        },
        function (error, results) {
            if (error) {
                console.log("error in results ", error);
                callback(error, "Error")
            }
            else {
                console.log(results);
                callback(null, results);
            };
        });

};
exports.handle_request = handle_request;
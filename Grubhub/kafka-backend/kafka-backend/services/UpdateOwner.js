var db = require('../models/schema');
var restownerModel = db.restownerModel;
// var mongoose = require('mongoose');

function handle_request(msg, callback) {
      restownerModel.updateOne({ _id: msg.restaurantId },
        {
            $set: {
                owner_firstName: msg.owner_firstName,
                owner_lastName: msg.owner_lastName,
                owner_phone: msg.owner_phone,
                owner_Image: msg.owner_Image,
                cuisine: msg.cuisine,
                restaurantName: msg.restaurantName,
                zipCode: msg.zipCode,
                restaurantImage: msg.restaurantImage
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
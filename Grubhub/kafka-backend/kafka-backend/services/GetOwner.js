var db = require('../models/schema');
var restownerModel = db.restownerModel;

function handle_request(msg, callback) {
    restownerModel.find({ _id: msg.restaurantId }, function (error, results) {

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
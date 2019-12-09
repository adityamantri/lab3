var db = require('../models/schema');
var orderModel = db.orderModel;

function handle_request(msg, callback) {
    orderModel.updateOne({ series: msg.series },
        {
            $set: {
                orderStatus: msg.orderStatus
            }
        },
        function (error, results) {
            // kafka.make_request('orderUpcomingOrder', req.body, function (error, results) {
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
var db = require('../models/schema');
var orderModel = db.orderModel;

function handle_request(msg, callback){
    orderModel.find({ buyerId: msg.buyerId, orderStatus: { $nin: ["DELIVERED", "CANCEL"] } },function (error, results) {
        // kafka.make_request('orderUpcomingOrder', req.body, function (error, results) {
            console.log("msg.buyer" ,msg.buyerId)
            if (error) {
                console.log("error in results ", error);
                callback(error,"Error")
            }
            else {
                console.log("Kafka result upcoming order---------------",results);
                // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
                callback(null,results);
            };
        });
    
    };
exports.handle_request = handle_request;
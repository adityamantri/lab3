var db = require('../models/schema');
var orderModel = db.orderModel;

function handle_request(msg, callback){
    console.log("msg in Kafka ::",msg)
     orderModel.updateOne({ _id: msg._id },
        {
            $push: {
                message: msg.message
            }
        },
        function (error, result) {
    // kafka.make_request('orderMessage', req.body, function (error, results) {

        if (error) {
            console.log("error in results", error);
            callback(error)
        }
        else {
            result = { output: "order Status Updated" };
            console.log(result);
            // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
            callback(null,result);
        };
    });
    
    };
exports.handle_request = handle_request;
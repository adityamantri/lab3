var db = require('../models/schema');
var sectionModel = db.restownerModel;
var mongoose = require('mongoose');

function handle_request(msg, callback){
sectionModel.update({ _id: msg.restaurantId },
        {
            $pull:
            {
                "section":
                     { sectionId: { $eq: mongoose.Types.ObjectId(msg.sectionId) } }
            }
        },
        function (error, results) {
                // kafka.make_request('orderUpcomingOrder', req.body, function (error, results) {
            if (error) {
                console.log("error in results ", error);
                callback(error,"Error")
            }
            else {
                console.log(results);
                // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
                callback(null,results);
            };
        });
    
    };
exports.handle_request = handle_request;
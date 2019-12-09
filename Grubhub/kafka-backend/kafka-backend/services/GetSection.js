var db = require('../models/schema');
var sectionModel = db.restownerModel;

function handle_request(msg, callback){
    console.log("msg",msg)
    sectionModel.find({ _id: msg.restaurantId }, { section: 1 }, function (error, results) {

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
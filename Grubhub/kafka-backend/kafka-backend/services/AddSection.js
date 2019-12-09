var db = require('../models/schema');
var sectionModel = db.restownerModel;
var mongoose = require('mongoose');


function handle_request(msg, callback){
    sectionModel.update({ _id: msg.restaurantId },
            {
                $push: {
                    section: {
                        sectionId: new mongoose.Types.ObjectId(),
                        sectionName: msg.sectionName,
                        sectionDescription: msg.sectionDescription,
                        item: []
                    }
                }
            },
            function (error, results) {
            if (error) {
                console.log("error in results ", error);
                callback(error,"Error")
            }
            else {
                console.log("Successfully added");
                sectionModel.find({ _id: msg.restaurantId }, { section: 1 }, function (err, result) {
                    if (err) {
                        res.cookie('itemerror', "error in adding item", { maxAge: 900000, httpOnly: false, path: '/' });
                        callback(error,"fetch item after addition error");
                    } else {
                        result = JSON.stringify(result);
                        
                // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
                callback(null,result);
            };
        })}
        });
    
    };
exports.handle_request = handle_request;
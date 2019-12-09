var db = require('../models/schema');
var sectionModel = db.restownerModel;
var mongoose = require('mongoose');


function handle_request(msg, callback){
     sectionModel.updateOne({ _id: msg.restaurantId, section: { $elemMatch: { sectionId: { $eq: mongoose.Types.ObjectId(msg.sectionId) } } } },
        {
            "$set": {
                "section.$.sectionName": msg.sectionName,
                "section.$.sectionDescription": msg.sectionDescription
            }
        },
        { section: { $elemMatch: { sectionId: { $eq: mongoose.Types.ObjectId(msg.sectionId) } } } },
        function (error, results) {
        if (error) {
                console.log("error in results ", error);
                callback(error,"Error")
            }
            else {
                console.log(results);
                output = sectionModel.find({ _id: msg.restaurantId }, { section: 1 }, function (error, result) {
                    result = JSON.stringify(result);
                    console.log(result);
                    // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
                    callback(null,result);
                });
            };
        });
    
    };
exports.handle_request = handle_request;
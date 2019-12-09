var db = require('../models/schema');
var sectionModel = db.restownerModel;
var mongoose = require('mongoose');

function handle_request(msg, callback){
    sectionModel.update(
            {
                _id: msg.restaurantId
            },
            {
                "$set": {
                    "section.$[outer].item.$[inner].itemName": msg.itemName,
                    "section.$[outer].item.$[inner].itemDescription": msg.itemDescription,
                    "section.$[outer].item.$[inner].itemPrice": msg.itemPrice
                    //  "section.$[outer].item.$[inner].itemImage": type 
                }
            },
            {
                "arrayFilters": [
                    { "outer.sectionId": mongoose.Types.ObjectId(msg.sectionId) },
                    { "inner.itemId": mongoose.Types.ObjectId(msg.itemId) }
                ]
            },
            function (error, results) {
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
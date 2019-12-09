// var Food = require('../models/Food');
var db = require('../models/schema');
var sectionModel = db.restownerModel;

function handle_request(msg, callback){
    // console.log("Inside kafka backend--------------------");
    // console.log(JSON.stringify(msg));
    // let email = msg['email'];
    // console.log(email);
    console.log('Connected to mongodb');
    sectionModel.find({ "section.item.itemName": msg.itemName }, function (error, results) {
        if (error) {
            console.log("error in Kafka results ");
            callback(error,"Error");
        }
        else {
            console.log(results);
            let restlist = [];
            results.forEach(element => {
                console.log("element", element._id)
                let rest = {
                    restaurantId: element._id,
                    restaurantName: element.restaurantName,
                    cuisine: element.cuisine
                }
                restlist.push(rest);
            });
            console.log(restlist);
            // res.cookie('section', restlist, { maxAge: 900000, httpOnly: false, path: '/' });
            callback(null,restlist);
        };
});
    };
exports.handle_request = handle_request;
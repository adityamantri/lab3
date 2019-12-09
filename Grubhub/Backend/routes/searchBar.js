var express = require('express');
var router = express.Router();
var app = express();
var db = require('./schema');
var sectionModel = db.restownerModel;
var passport = require("passport");
const kafka = require("../kafka/client");

//Search Item from buyer page
router.post('/searchRestaurant', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    // let pass = `Select restaurantId, restaurantName, cuisine from mydb.restowner where restaurantId IN
    // (select restId from mydb.item where itemName LIKE '%${req.body.itemName}%')`;
    // sectionModel.find({ "section.item.itemName": req.body.itemName }, function (error, results) {
        kafka.make_request('search_restaurant',req.body, function(error,results){
        if (error) {
            console.log("error in results ");
            res.status(404).send(error)
        }
        else {
            // console.log(results);
            // let restlist = [];
            // results.forEach(element => {
            //     console.log("element", element._id)
            //     let rest = {
            //         restaurantId: element._id,
            //         restaurantName: element.restaurantName,
            //         cuisine: element.cuisine
            //     }
            //     restlist.push(rest);
            // });
            // console.log(restlist);
            res.cookie('section', results, { maxAge: 900000, httpOnly: false, path: '/' });
            res.status(200).send(results);
        };
    });
});

module.exports = router;

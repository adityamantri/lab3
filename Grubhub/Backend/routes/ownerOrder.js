var express = require('express');
var router = express.Router();
var db = require('./schema');
var orderModel = db.orderModel;
var passport = require("passport");
var kafka= require('../kafka/client');

//Search Item from buyer page
router.post('/currentOrder', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    kafka.make_request('ownerCurrentOrder', req.body, function (error, result) {
    // orderModel.find({ restId: req.body.restId, orderStatus: { $nin: ["DELIVERED", "CANCEL"] } },
    //     function (error, result) {
            if (error) {
                console.log("error in results ", error);
                res.status(205).send(error)
            }
            else {
                console.log(result);
                res.status(200).send(result);
            };
        });
});

//Search Item from buyer page
router.post('/pastOrder', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    kafka.make_request('ownerPastOrder', req.body, function (error, result) {
    // orderModel.find({ restId: req.body.restId, orderStatus: { $in: ["DELIVERED", "CANCEL"] } },
    //     function (error, result) {
            console.log(req.body.restId)
            if (error) {
                console.log("error in results ", error);
                res.status(205).send(error)
            }
            else {
                console.log(result);
                res.status(200).send(result);
            };
        });
});

router.post('/updateOrderStatus', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    kafka.make_request('ownerUpdateOrderStatus', req.body, function (error, result) {
    // orderModel.updateOne({ series: req.body.series },
    //     {
    //         $set: {
    //             orderStatus: req.body.orderStatus
    //         }
    //     },
    //     function (error, result) {
            if (error) {
                console.log("error in results", error);
                res.status(205).send(error)
            }
            else {
                result = { output: "order Status Updated" };
                kafka.make_request('ownerCurrentOrder', req.body, function (error, results) {
                console.log(result);
                // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
                res.status(200).send(results);
                })
            };
        });
});

router.post('/sendMessage', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log("req.body is--------", req.body)
    kafka.make_request('orderMessage', req.body, function (error, results) {

        if (error) {
            console.log("error in results", error);
            res.status(205).send(error)
        }
        else {
            kafka.make_request('ownerCurrentOrder', req.body, function (error, result) {
            console.log("in message ownerCurrentOrder result");
            res.status(200).send(result);
        })
        };
    });
});

module.exports = router;
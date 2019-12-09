var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
// var mysql = require('mysql');
var db = require('./schema');
var orderModel = db.orderModel;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require('../db');
var mongoose = require('mongoose');
var passport = require("passport");
const kafka = require("../kafka/client");


//Search Item from buyer page
router.post('/upcomingOrder', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    // orderModel.find({ buyerId: req.body.buyerId, orderStatus: { $nin: ["DELIVERED", "CANCEL"] } },function (error, result) {
    kafka.make_request('orderUpcomingOrder', req.body, function (error, results) {

        if (error) {
            console.log("error in results ", error);
            res.status(205).send(error)
        }
        else {
            console.log(results);
            // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
            res.status(200).send(results);
        };
    });
});

//Search Item from buyer page
router.post('/pastOrder', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    // orderModel.find({ buyerId: req.body.buyerId, orderStatus: { $in: ["DELIVERED", "CANCEL"] } },function (error, result) {
    kafka.make_request('orderPastOrder', req.body, function (error, result) {
        if (error) {
            console.log("error in results ", error);
            res.status(205).send(error)
        }
        else {
            console.log(result);
            // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
            res.status(200).send(result);
        };
    });
});




router.post('/add', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log("req.body is--------", req.body.cart)
    arrf = [];
    orderId = new mongoose.Types.ObjectId()
    req.body.cart.forEach(element => {
        let arrtemp = {
            orderId: orderId,
            series: new mongoose.Types.ObjectId()
        };

        let arrtemp1 = Object.assign(element, arrtemp);
        arrf.push(arrtemp1)
    });

    // orderModel.insertMany(arrf, function (error, result) {
    kafka.make_request('orderAdd', arrf, function (error, result) {

        if (error) {
            console.log("error in results", error);
            res.status(205).send(error);
        }
        else {
            console.log(result);
            result = { output: "order accepted" };
            // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
            res.status(200).send(result);
        };
    });
})

router.post('/sendMessage', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log("req.body is--------", req.body)
    // orderModel.updateOne({ _id: req.body._id },
    //     {
    //         $push: {
    //             message: req.body.message
    //         }
    //     },
    //     function (error, result) {
    kafka.make_request('orderMessage', req.body, function (error, results) {

        if (error) {
            console.log("error in results", error);
            res.status(205).send(error)
        }
        else {
            // req.body.buyerId= req.body._id;
            kafka.make_request('orderUpcomingOrder', req.body, function (error, result) {
            // result = { output: "order Status Updated" };
            console.log("in message upcoming result");
            // console.log(results);
            // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
            res.status(200).send(result);

            // res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
            // res.status(200).send(results);
        })
        };
    });
});

module.exports = router;
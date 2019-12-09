var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
// var mysql = require('mysql');
var db = require('./schema');
var restownerModel = db.restownerModel;
//require('dotenv').config();
const bcrypt = require('bcrypt');
require('dotenv').config();
var kafka = require('../kafka/client')

var jwt = require('jsonwebtoken');
var passport = require("passport");


const saltRounds = 10;
// const pool = require('../db');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/owner/')
    },
    filename: function (req, file, cb) {
        cb(null, JSON.parse(req.cookies.owner).restaurantId + '.jpg');
    }
})

const upload = multer({ storage: storage });

router.post("/upload", upload.single('productImage'), (req, res, next) => {
    productImage = req.file.path;
    res.status(200).send(productImage);
})

router.get('/getOwner/:restaurantId', passport.authenticate('jwt', { session: false }), function (req, res) {
    console.log("req param ", req.params.restaurantId);
    console.log("req: ", req.headers.authorization);
    //let pass = `select * from mydb.restowner WHERE restaurantId = '${req.params.restaurantId}'`;
    kafka.make_request('getOwner', req.params, function (error, results) {
        // restownerModel.find({ _id: req.params.restaurantId }, function (error, results) {
        if (error) {
            console.log("error in results ");
            throw error;
        }
        else {
            console.log("results", results)
            //console.log('Body Content', req.body.password);
            results[0]["restaurantId"] = results[0]._id;
            console.log(results[0]);
            owner = JSON.stringify(results[0]);
            res.cookie('owner', owner, { encode: String });
            res.writeHead(200);
            res.end(JSON.stringify(results[0]));

        };
    });
});

// restOwner signUp
router.post('/signUpOwner', function (req, res) {

    console.log("Inside signUpOwner Post Request");
    console.log("Req Body : ", req.body);
    let owner_firstName = req.body.owner_firstName;
    let owner_lastName = req.body.owner_lastName;
    let owner_email = req.body.owner_email;
    let owner_password = req.body.owner_password;
    let owner_phone = req.body.owner_phone;
    let restaurantName = req.body.restaurantName;
    let zipCode = req.body.zipCode;
    let cuisine = req.body.cuisine;

    bcrypt.hash(owner_password, saltRounds, function (err, hash) {
        req.body.hash = hash;
        kafka.make_request('signUpOwner', req.body, function (error, results) {

            // restownerModel.find({ owner_email: owner_email }, function (err, results) {

            //     if (res.length > 0) {
            //         console.log("email id exists");
            //         res.cookie('cookie', "error", { maxAge: 900000, httpOnly: false, path: '/' });
            //         res.status(200).send("Email Id already exists!");
            //         res.end();
            //     }
            // });
            // var insertSignUp = new restownerModel({
            //     owner_firstName: owner_firstName,
            //     owner_lastName: owner_lastName,
            //     owner_password: hash,
            //     cuisine: cuisine,
            //     restaurantName: restaurantName,
            //     zipCode: zipCode,
            //     owner_phone: owner_phone,
            //     owner_email: owner_email
            // })
            // insertSignUp.save(function (error, results) {
            if (error) {
                throw error;
            }
            else {
                console.log("done");
                output = restownerModel.find({ owner_email: owner_email }, (update, result) => {
                    console.log("output from mongoDB ", result[0]);
                    result[0]["restaurantId"] = result[0]._id;
                    owner = JSON.stringify(result[0]);
                    res.cookie('owner', owner, { encode: String });

                    //Creating JWT
                    const token = jwt.sign({ _id: result[0]._id }, "jsdklajklwer");
                    res.setHeader("Access-Control-Expose-Headers", "Authorization");
                    res.header('Authorization', "token " + token)
                    res.send(result[0]);
                    //    res.status(200).send(result[0]);
                }
                );
            }
        });
    });
})

//Sign in Owner
router.post('/signInOwner', function (req, res) {
    kafka.make_request('signInOwner', req.body, function (error, results) {

        // restownerModel.find({ owner_email: req.body.owner_email }, function (error, results) {
        //     if (error) {
        //         console.log("error in results --------", results);
        //         throw error;
        //     }
        //     else if (results.length == 0) {
        //         output = { ownerError: "Incorrect userId" };
        //         res.status(200).send(output);
        //     } else {

        //         bcrypt.compare(req.body.owner_password, results[0].owner_password, function (err, resSt) {
        if (!error) {
            console.log("COMPARE working-------------------", results)
            output = "SuccessFull Login";
            results[0]["restaurantId"] = results[0]._id;
            owner = JSON.stringify(results[0]);
            console.log(owner, "results[0]", results[0])
            res.cookie('owner', owner, { encode: String });

            //Creating jwt
            const token = jwt.sign({ _id: results[0]._id }, "jsdklajklwer");
            res.setHeader("Access-Control-Expose-Headers", "Authorization");
            res.setHeader('Authorization', "token " + token)
            res.send(results[0]);
            res.end();
            // res.status(200).send(results[0]);
        }
        else {
            console.log("compare not  working-------------------")
            output = { ownerError: "UnSuccessfull Login" };
            res.status(200).send(output);
        }
        // });
        // };
    });
});

//Update Owner
router.post('/updateOwner', passport.authenticate('jwt', { session: false }), function (req, res, next) {

    let restaurantId = req.body.restaurantId;
    kafka.make_request('updateOwner', req.body, function (error, results) {

        // restownerModel.updateOne({ _id: req.body.restaurantId },
        //     {
        //         $set: {
        //             owner_firstName: req.body.owner_firstName,
        //             owner_lastName: req.body.owner_lastName,
        //             owner_phone: req.body.owner_phone,
        //             owner_Image: req.body.owner_Image,
        //             cuisine: req.body.cuisine,
        //             restaurantName: req.body.restaurantName,
        //             zipCode: req.body.zipCode,
        //             restaurantImage: req.body.restaurantImage
        //         }
        //     },
        //     function (error, results) {

        if (error) {
            console.log("error in results ");
            throw error;
        }
        else {
            console.log(req.body.restaurantId)
            output = restownerModel.find({ _id: req.body.restaurantId }, (update, result) => {
                result[0]["restaurantId"] = result[0]._id;
                owner = JSON.stringify(results[0]);
                res.cookie('owner', owner, { encode: String });
                res.status(200).send(result[0]);
            });
        };
    });
});

module.exports = router;

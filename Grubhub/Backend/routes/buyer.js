var express = require('express');
var router = express.Router();
// import the require dependencies
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var cors = require('cors');
// var mysql = require('mysql');
var db = require('./schema');
var jwt = require('jsonwebtoken');
var buyerModel = db.buyerModel;
var restownerModel = db.restownerModel;
var kafka = require('../kafka/client')

const bcrypt = require('bcrypt');

var passport = require("passport");
// var jwtOptions = {}
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
// jwtOptions.secretOrKey = jsdklajklwer;

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("token");
opts.secretOrKey = "jsdklajklwer";
// passport.use(new JwtStrategy);
passport.use("jwt", new JwtStrategy(opts, function (jwt_payload, done) {
    // kafka.make_request('jwtValidation', jwt_payload, function (error, results) {

        buyerModel.findOne({ _id: jwt_payload._id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                console.log("inside else---- restownermodel--------")
                restownerModel.findOne({ _id: jwt_payload._id }, function (err, user) {
                    if (err) {
                        return done(err, false);
                    }
                    if (user) {
                        console.log("restowner found----")
                        return done(null, user);
                    } else {
                        console.log("restowner not found------");
                        return done(null, false);
                        // or you could create a new account
                    }
                });
                //return done(null, false);
                // or you could create a new account
            }
        });
    }));



const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/buyer/')
    },
    filename: function (req, file, cb) {
        cb(null, JSON.parse(req.cookies.buyer).buyerId + '.jpg');
    }
})

const upload = multer({ storage: storage });
const saltRounds = 10;
// const pool = require('../db');

app.use(bodyParser.json());

router.post("/upload", upload.single('productImage'), (req, res, next) => {
    productImage = req.file.path;
    res.status(200).send(productImage);
})

router.get('/getBuyer/:buyerId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log("req param ", req.params.buyerId);
    kafka.make_request('getBuyer', req.params, function (error, results) {

        // buyerModel.find({ _id: req.params.buyerId }, function (error, results) {
        if (error) {
            console.log("error in results ");
            throw error;
        }
        else {
            console.log(results[0]);
            results[0]["buyerId"] = results[0]._id;
            buyer = JSON.stringify(results[0]);
            res.cookie('buyer', buyer, { encode: String });
            res.status(200).send(results[0]);
        };
    });
});


//Update Buyer
router.post('/updateBuyer', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    kafka.make_request('updateBuyer', req.body, function (error, results) {

        // buyerModel.updateOne({ _id: req.body.buyerId },
        //     {
        //         $set: {
        //             firstName: req.body.firstName,
        //             lastName: req.body.lastName,
        //             phone: req.body.phone,
        //             address: req.body.address
        //         }
        //     },
        //     function (error, results) {
        if (error) {
            console.log("error in results ");
            throw error;
        }
        else {
            console.log("req", req)
            output = buyerModel.find({ _id: req.body.buyerId }, (update, result) => {
                result[0]["buyerId"] = req.body.buyerId;
                var buyer = JSON.stringify(result[0]);
                res.cookie('buyer', buyer, { encode: String });
                res.status(200).send(result[0]);
            });
        };
    });

});

// Buyer Sign In
router.post('/signInBuyer', function (req, res, next) {
    kafka.make_request('signInBuyer', req.body, function (error, results) {

        // buyerModel.find({ email: req.body.email }, function (error, results) {
        // if (error) {
        //     console.log("error in results : error returned from database");
        //     throw error;
        // }
        // else if (results.length == 0) {
        //     output = "Incorrect userId";
        //     res.status(200).send(output);
        // } else {
        //     console.log('Body Content', req.body.password);
        //     console.log(results[0].password);

        //     bcrypt.compare(req.body.password, results[0].password, function (err, resSt) {
        if (results) {
            console.log("COMPARE working-------------------")
            output = "SuccessFull Login";
            results[0]["buyerId"] = results[0]._id;
            buyer = JSON.stringify(results[0]);
            res.cookie('buyer', buyer, { encode: String });

            // Create and assign a token
            const token = jwt.sign({ _id: results[0]._id }, "jsdklajklwer");
            res.setHeader("Access-Control-Expose-Headers", "Authorization");
            res.header('Authorization', "token " + token).send(buyer);

            //res.status(200).send(results[0]);
            // res.writeHead(200);
            // res.end(buyer);
        }
        else {
            console.log("not compare working-------------------");
            data = {
                error: "Invalid login credentials"
            };
            output = "Invalid login credentials";
            res.status(200).send(data);
        }
    });
    // };
    // });
});

//Route to handle Post Request Call
router.post('/signUpBuyer', function (req, res) {

    console.log("Inside signUpBuyer Post Request");
    console.log("Req Body : ", req.body);
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;

    // pool.getConnection(function (error, conn) {

    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.

        //  var emailcheck = `Select * from mydb.buyer where email='${email}' `;
        //  pool.query(emailcheck, function (error, results) {
        req.body.hash = hash;
        kafka.make_request('signUpBuyer', req.body, function (error, results) {

            // buyerModel.find({ email: email }, function (err, results) {

            //     if (results.length > 0) {
            //         console.log("email id exists");
            //         res.cookie('cookie', "error", { maxAge: 900000, httpOnly: false, path: '/' });
            //         res.status(200).send("Email Id already exists!");
            //         res.end();
            //     }
            // });
            // var insertSignUp = new buyerModel({
            //     firstName: firstName,
            //     lastName: lastName,
            //     email: email,
            //     password: hash
            // })
            // insertSignUp.save(function (error, results) {
            if (error) {
                res.cookie('cookie', "error", { maxAge: 900000, httpOnly: false, path: '/' });
                res.status(200).send("error");
                res.end();
            }
            else {
                console.log("done");
                res.cookie('cookie', "Added Successfully", { maxAge: 900000, httpOnly: false, path: '/' });
                res.status(201).send("Added Successfully");
            }
        });
    });
});
// })

module.exports = router;

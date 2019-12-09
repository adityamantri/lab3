var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
// var mysql = require('mysql');
var db = require('./schema');
var sectionModel = db.restownerModel;
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const pool = require('../db');
var mongoose = require('mongoose');
var passport = require("passport");
const kafka = require("../kafka/client");



const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/restImage/')
    },
    filename: function (req, file, cb) {
        cb(null, JSON.parse(req.cookies.owner).restaurantId + 'rest' + '.jpg');
    }
})

const upload = multer({ storage: storage });

router.post("/upload", upload.single('productImage'), (req, res, next) => {
    productImage = req.file.path;
    res.status(200).send(productImage);
})

router.get('/getSection/:restaurantId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log("req param ", req.params.restaurantId);
    //let pass = `select * from mydb.section WHERE restId = '${req.params.restaurantId}'`;

    kafka.make_request('getSection', req.params, function (error, results) {
    // sectionModel.find({ _id: req.params.restaurantId }, { section: 1 }, function (error, results) {
        if (error) {
            console.log("error in results ");
            throw error;
        }
        else {
            console.log(results);
            section = JSON.stringify(results);
            res.cookie('section', section, { encode: String });
            res.status(200).send(results);
        };
    });
});

// add new section
router.post('/addSection', passport.authenticate('jwt', { session: false }), function (req, res) {

    console.log("Inside addSection Post Request");
    console.log("Req Body : ", req.body);
    let sectionName = req.body.sectionName;
    let sectionDescription = req.body.sectionDescription;
    let restId = req.body.restaurantId;
    
    kafka.make_request('addSection', req.body, function (error, result) {

    // sectionModel.update({ _id: restId },
    //     {
    //         $push: {
    //             section: {
    //                 sectionId: new mongoose.Types.ObjectId(),
    //                 sectionName: req.body.sectionName,
    //                 sectionDescription: req.body.sectionDescription,
    //                 item: []
    //             }
    //         }
    //     },
    //     function (error, results) {
        
            if (error) {
                res.status(200).send("addSection query error", error);
            }
            else {
                // console.log("Successfully added");
                // sectionModel.find({ _id: restId }, { section: 1 }, function (error, result) {
                //     if (error) {
                //         res.cookie('itemerror', "error in adding item", { maxAge: 900000, httpOnly: false, path: '/' });
                //         res.status(200).send("fetch item after addition error");
                //     } else {
                //         result = JSON.stringify(result);
                //         console.log(result);
                        res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
                        res.status(201).send(result);
                //     }
                // });
            }
        });
    // })
});


//delete section
router.delete('/deleteSection/:sectionId/:restaurantId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    //let pass = `DELETE FROM mydb.item WHERE  sectionId='${req.params.sectionId}'`;
    let body={sectionId:req.params.sectionId,
    restaurantId:req.params.restaurantId}
    kafka.make_request('deleteSection', body, function (error, results) {
        let output = "Not success";
    // sectionModel.update({ _id: JSON.parse(req.cookies.owner).restaurantId },
    //     {
    //         $pull:
    //         {
    //             "section":
    //                  { sectionId: { $eq: mongoose.Types.ObjectId(req.params.sectionId) } }
    //         }
    //     },
    //     function (error, results) {

            if (error) {
                console.log("error in results --------", results);
                throw error;
            }
            else {
                console.log("mongo output", results)
                kafka.make_request('getSection', req.params, function (error, result) {

                // sectionModel.drop({ _id: req.params.sectionId }, function (error, results) {
                output = "Deleted";
                res.end(result);
                })
            }
        });
    console.log(output);
});

//Update section
router.post('/updateSection', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    // let pass = `UPDATE mydb.section
    // SET
    // sectionName='${req.body.sectionName}',
    // sectionDescription='${req.body.sectionDescription}'
    // WHERE sectionId = ${req.body.sectionId}`;
    
    // req.body.restaurantId=JSON.parse(req.cookies.owner).restaurantId;

    kafka.make_request('updateSection', req.body, function (error, result) {

    // sectionModel.updateOne({ _id: JSON.parse(req.cookies.owner).restaurantId, section: { $elemMatch: { sectionId: { $eq: mongoose.Types.ObjectId(req.body.sectionId) } } } },
    //     {
    //         "$set": {
    //             // "section.$":section1
    //             "section.$.sectionName": req.body.sectionName,
    //             "section.$.sectionDescription": req.body.sectionDescription
    //         }
    //     },
    //     { section: { $elemMatch: { sectionId: { $eq: mongoose.Types.ObjectId(req.body.sectionId) } } } },
    //     function (error, results) {
            if (error) {
                console.log("error in results ", error);
                throw error;
            }
            else {
                // output = sectionModel.find({ _id: JSON.parse(req.cookies.owner).restaurantId }, { section: 1 }, function (error, result) {
                //     // result = JSON.stringify(result);
                //     // console.log(result);
                    res.cookie('section', result, { maxAge: 900000, httpOnly: false, path: '/' });
                    res.status(200).send(result);
                // });
            };
        });
});

module.exports = router;
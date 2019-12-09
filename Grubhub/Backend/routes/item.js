var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var db = require('./schema');
var sectionModel = db.restownerModel;
const multer = require('multer');
var mongoose = require('mongoose');
var passport = require("passport");
var kafka= require("../kafka/client")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/item/')
    },
    filename: function (req, file, cb) {
        // console.log(JSON.parse(req.cookies.getItemDetails).itemId)
        cb(null, file.originalname);
    }
})
const upload = multer({ storage: storage });
router.post("/upload", upload.single('productImage'), (req, res, next) => {
    console.log(req.body);
    req.body.image = req.file.filename;
    kafka.make_request('uploadItem', req.body, function (error, results) {

    // sectionModel.update(
    //     {
    //         _id: req.body.restaurantId
    //     },
    //     {
    //         "$set": {
    //             "section.$[outer].item.$[inner].itemImage": req.file.filename,
    //         }
    //     },
    //     {
    //         "arrayFilters": [
    //             { "outer.sectionName":req.body.sectionName },
    //             { "inner.itemId": mongoose.Types.ObjectId(req.body.itemId) }
    //         ]
    //     }
    //     , function (error, results) {
        if (error) {
            console.log("error in results--------", results);
            throw error;
        }
        else {
            console.log("Updated Image ",results)
            res.status(202).send();
        }
    });
})

app.use(bodyParser.json());

router.get('/getItem/:restaurantId',passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log("req param ", req.params.restaurantId);
    kafka.make_request('getItem', req.params, function (error, restResult) {
    //    sectionModel.find({ _id:req.params.restaurantId}, function (error, restResult) {
        if (error) {
            console.log("error in results ");
            throw error;
        }
        else {
            console.log(restResult);
            let result=[];
            let results=[];
            restResult[0].section.forEach(element=>{
                let restemp={
                    sectionName: element.sectionName,
            sectionDescription: element.sectionDescription,
            sectionId: element.sectionId,
            restId: restResult._id
                }
                results.push(restemp);
                element.item.forEach(ele=>{
                    let rest={
                        itemId: ele.itemId,
                        itemName: ele.itemName,
                        itemPrice: ele.itemPrice,
                        restId: restResult._id,
                        sectionId: element.sectionId,
                        itemDescription: ele.itemDescription,
                        itemImage: ele.itemImage
                    }
                    result.push(rest);
                })

            })

           res.status(200).send (JSON.stringify({ results: results, result: result }));
            // };
            // });
        }
    });
});

//Route to handle Post Request Call
router.post('/addItem', passport.authenticate('jwt', { session: false }), function (req, res) {

    console.log("Inside addItem Post Request");
    console.log("Req Body : ", req.body);

    let restaurantId = req.body.restaurantId;
    kafka.make_request('addItem', req.body, function (error, result) {
    // sectionModel.update({
    //     _id: req.body.restaurantId,
    //     "section.sectionId": mongoose.Types.ObjectId(req.body.sectionId)
    // },
    //     {
    //         $push: {
    //             "section.$.item": {
    //                 itemId: new mongoose.Types.ObjectId(),
    //                 itemName: req.body.itemName,
    //                 itemDescription: req.body.itemDescription,
    //                 itemImage: req.body.itemImage,
    //                 itemPrice: req.body.itemPrice
    //             }
    //         }
    //     },
    //     function (error, result) {
            if (error) {
                console.log(error);
                res.status(200).send("additem query error");
            }
            else {
                console.log("done item Added");
                kafka.make_request('getItemDisplay', req.body, function (error, itemResults) {
                // result = JSON.stringify(result);
                // res.cookie('itemAdded', result, { maxAge: 900000, httpOnly: false, path: '/' });
                res.status(201).send(itemResults);
                });
            }
        });
    //  })

});

router.post('/deleteItem', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log("reached item delete", req.body)

    let output = "Not success";
    kafka.make_request('deleteItem', req.body, function (error, result) {
        // sectionModel.update(
    //     {
    //         _id: req.body.restaurantId,
    //         "section.sectionName": req.body.sectionName
    //     },
    //     { $pull: { "section.$.item": { itemName: req.body.itemName } } },
    //     function (error, result) {
            if (error) {
                console.log("error in results--------", error);
                throw error;
            }
            else {
                kafka.make_request('getItemDisplay', req.body, function (error, itemResults) {
                console.log("deleted itemmmmmmmm", result)
                output = "Deleted";
                res.status(202).send(itemResults);
                })
            }
            // });
        });
});

router.post('/updateItem', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    let output = "Not Updated";
    kafka.make_request('updateItem', req.body, function (error, result) {
    // sectionModel.update(
    //     {
    //         _id: req.body.restaurantId
    //     },
    //     {
    //         "$set": {
    //             "section.$[outer].item.$[inner].itemName": req.body.itemName,
    //             "section.$[outer].item.$[inner].itemDescription": req.body.itemDescription,
    //             "section.$[outer].item.$[inner].itemPrice": req.body.itemPrice
    //             //  "section.$[outer].item.$[inner].itemImage": type 
    //         }
    //     },
    //     {
    //         "arrayFilters": [
    //             { "outer.sectionId": mongoose.Types.ObjectId(req.body.sectionId) },
    //             { "inner.itemId": mongoose.Types.ObjectId(req.body.itemId) }
    //         ]
    //     },
    //     function (error, result) {
            if (error) {
                console.log("error in results "), error;
                throw error;
            }
            else {
                
                console.log(result);
                result = JSON.stringify(result);

                //res.cookie('item', result, { maxAge: 900000, httpOnly: false, path: '/' });
                res.status(200).send(result);
                //  });
            };
        });
    console.log(output);
});

router.post('/getItemDetails', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    kafka.make_request('getItemDetails', req.body, function (error, results) {
    // sectionModel.find({
    //     _id: req.body.restaurantId,
    //     "section.sectionName": req.body.sectionName,
    //     "section.item.itemName": req.body.itemName
    // },
    //     function (error, results) {
            if (error) {
                console.log("error in results ", error);
                throw error;
            }
            else {
                var result = null;
                let sect = results[0];
                sect.section.forEach(element => {
                    element.item.forEach(element1 => {
                        if (element1.itemName === req.body.itemName) {
                            sect = element1;
                            sect.sectionName = element.sectionName;
                            sect.sectionId = element.sectionId;
                        }
                    });
                });
                section = JSON.stringify(results);
                res.cookie('getItemDetails', section, { encode: String });
                res.status(200).send([sect]);
            };
        });
});

router.get('/getItemDisplay/:restaurantId', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    // sectionModel.find({ _id: req.params.restaurantId }, { section: 1 }, function (error, itemResults) {
    kafka.make_request('getItemDisplay', req.params, function (error, itemResults) {
    if (error) {
            console.log("error in results ");
            throw error;
        }
        else {
            console.log(itemResults);
            let result = [];
            let sect = itemResults[0];

            sect.section.forEach(element => {
                element.item.forEach(element1 => {
                    element1.sectionName = element.sectionName;
                    element1.sectionId = element.sectionId;
                    element1.sectionDescription = element.sectionDescription;
                    element1.restId = req.params.restaurantId;

                    result.push(element1)
                });
            });

            res.cookie('item', itemResults, { encode: String });
            res.status(200).send({ result: result });
        };
    });
});

module.exports = router;

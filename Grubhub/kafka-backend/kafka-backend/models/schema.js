// var express = require('express');
// var router = express.Router();
// var app = express();
// var session = require('express-session');
// var cookieParser = require('cookie-parser');
// app.use(cookieParser());
//require('dotenv').config();
var mongoose = require('mongoose');


mongoose.connect('mongodb+srv://root:root@cluster1-9j3qi.mongodb.net/mydb?retryWrites=true&w=majority', { useNewUrlParser: true });

var buyerSchema = new mongoose.Schema({
    buyerId: String,
    phone: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    address: String
})
var buyerModel = mongoose.model('buyer', buyerSchema, 'buyers');

var restownerSchema = new mongoose.Schema({
    restaurantId: String,
    owner_firstName: String,
    owner_lastName: String,
    owner_email: String,
    owner_phone: String,
    owner_password: String,
    //owner_Image : String,
    cuisine: String,
    restaurantName: String,
    zipCode: String,
    section: []
    //restaurantImage: String
})
var restownerModel = mongoose.model('restowner', restownerSchema, 'restowners');

var sectionSchema = new mongoose.Schema({
    sectionId: String,
    sectionName: String,
    sectionDescription: String,
    restId: String
})
var sectionModel = mongoose.model('section', sectionSchema, 'section');

var itemSchema = new mongoose.Schema({
    itemId: String,
    itemName: String,
    itemPrice: String,
    restId: String,
    sectionId: String,
    itemDescription: String,
    itemImage: String
})
var itemModel = mongoose.model('item', itemSchema, 'item');

var orderSchema = new mongoose.Schema({
    orderId: String,
    restId: String,
    buyerId: String,
    restName: String,
    orderStatus: String,
    itemName: String,
    orderItemQty: String,
    series: String,
    itemPrice: String,
    address: String,
    firstName: String,
    message: Array
})
var orderModel = mongoose.model('orderFood', orderSchema, 'orderFood');

module.exports = {
    buyerModel: buyerModel,
    restownerModel: restownerModel,
    sectionModel: sectionModel,
    itemModel: itemModel,
    orderModel: orderModel
}



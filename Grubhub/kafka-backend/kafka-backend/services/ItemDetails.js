var Food = require('../models/Food');

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let email = msg['email'];
    console.log(email);
    console.log('Connected to mongodb');
    Food.find({item_name:msg.name, rest_email:msg.rest_email},function(err,results){
        if(err)
        {
            console.log('error-->');
            callback(err,"Error");
        }  
        else
        {
            console.log('results-->',JSON.stringify(results));
            callback(null, results);
        }
        console.log("after callback");
    })  
};
exports.handle_request = handle_request;
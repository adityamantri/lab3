var Food = require('../models/Food');

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let email = msg['email'];
    console.log(email);
    console.log('Connected to mongodb');
    Food.find({rest_email:email},function(err,results){
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
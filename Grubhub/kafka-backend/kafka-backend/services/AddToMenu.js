var Food = require('../models/Food');

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    var food = Food({
        item_name: msg.name,
        rest_email: msg.rest_email,
        rest_cuisine: msg.rest_cuisine,
        item_price: msg.price,
        item_section: msg.section,
        item_description: msg.description,
        rest_name:msg.rest_name
      });
      // Food.find({}, function(err, results) {
      // if (err) throw err;
          food.save(function(err) {
            if(err)
            {
                console.log('error-->');
                callback(err,"Error");
            }  
            else
            {
                console.log('succesfully added');
                callback(null, []);
            }
            console.log("after callback");
        })
};
exports.handle_request = handle_request;
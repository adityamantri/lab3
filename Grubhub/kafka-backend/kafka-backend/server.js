var connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
var SearchRestaurant = require('./services/SearchRestaurant.js');
var OrderUpcomingOrder = require('./services/OrderUpcomingOrder.js');
var OrderPastOrder = require('./services/OrderPastOrder.js');
var OrderAdd = require('./services/OrderAdd.js');
var OrderMessage= require('./services/OrderMessage')
var AddSection = require('./services/AddSection');
var UpdateSection = require('./services/UpdateSection');
var DeleteSection = require('./services/DeleteSection');
var GetSection= require('./services/GetSection.js')
var UpdateOrderStatus = require('./services/UpdateOrderStatus');
var OwnerPastOrder = require('./services/OwnerPastOrder');
var OwnerCurrentOrder= require('./services/OwnerCurrentOrder.js')
var UploadItem = require('./services/UploadItem');
var GetItem = require('./services/GetItem');
var AddItem = require('./services/AddItem');
var DeleteItem = require('./services/DeleteItem');
var UpdateItem = require('./services/UpdateItem');
var GetItemDetails = require('./services/GetItemDetails');
var GetItemDisplay = require('./services/GetItemDisplay');
var GetBuyer= require('./services/GetBuyer')
var SignUpBuyer= require('./services/SignUpBuyer')
var UpdateBuyer= require('./services/UpdateBuyer')
var SignInBuyer= require('./services/SignInBuyer')
var GetOwner= require('./services/GetOwner')
var SignUpOwner= require('./services/SignUpOwner')
var UpdateOwner= require('./services/UpdateOwner')
var SignInOwner= require('./services/SignInOwner')
var Database=require('./models/schema');

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
// first argument is topic name
// second argument is a function that will handle this topic request
handleTopicRequest("search_restaurant",SearchRestaurant)
handleTopicRequest("orderUpcomingOrder",OrderUpcomingOrder)
handleTopicRequest("orderPastOrder",OrderPastOrder)
handleTopicRequest("orderAdd",OrderAdd)
handleTopicRequest("orderMessage",OrderMessage)
handleTopicRequest("getSection",GetSection)
handleTopicRequest("deleteSection",DeleteSection)
handleTopicRequest("addSection",AddSection)
handleTopicRequest("updateSection",UpdateSection)
handleTopicRequest("ownerCurrentOrder",OwnerCurrentOrder)
handleTopicRequest("ownerPastOrder",OwnerPastOrder)
handleTopicRequest("ownerUpdateOrderStatus",UpdateOrderStatus)
handleTopicRequest("uploadItem",UploadItem)
handleTopicRequest("getItem",GetItem)
handleTopicRequest("addItem",AddItem)
handleTopicRequest("deleteItem",DeleteItem)
handleTopicRequest("updateItem",UpdateItem)
handleTopicRequest("getItemDetails",GetItemDetails)
handleTopicRequest("getItemDisplay",GetItemDisplay)
handleTopicRequest("getBuyer",GetBuyer)
handleTopicRequest("updateBuyer",UpdateBuyer)
handleTopicRequest("signUpBuyer",SignUpBuyer)
handleTopicRequest("signInBuyer",SignInBuyer)
handleTopicRequest("getOwner",GetOwner)
handleTopicRequest("signUpOwner",SignUpOwner)
handleTopicRequest("updateOwner",UpdateOwner)
handleTopicRequest("signInOwner",SignInOwner)



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var ownerRouter = require('./routes/owner');
var buyerRouter = require('./routes/buyer');
var itemRouter = require('./routes/item');
var sectionRouter= require('./routes/section');
var searchRouter= require('./routes/searchBar');
var orderRouter= require('./routes/order');
var ownerOrderRouter= require ('./routes/ownerOrder')
var passport = require('passport');
var graphqlHTTP= require('express-graphql');
const schema = require('./schema/schema');


var app = express();
var cors = require('cors');
//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
//Allow Access Control
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname+ '/uploads'));

app.use("/graphql",graphqlHTTP({
  schema,
  graphiql: true
}));


app.use(passport.initialize())

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/owner', ownerRouter);
app.use('/buyer', buyerRouter);
app.use('/section', sectionRouter);
app.use('/item', itemRouter);
app.use('/search', searchRouter);
app.use('/order', orderRouter);
app.use('/ownerOrder',ownerOrderRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3001);
console.log("Server Listening on port 3001");

module.exports = app;
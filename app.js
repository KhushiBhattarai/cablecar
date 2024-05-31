var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser =require("body-parser")

const expressSession = require("express-session");
const flash = require("connect-flash");

var indexRouter = require('./routes/route');
var usersRouter = require('./models/users');
var orderRouter = require('./routes/order');
const passport = require('passport');

//config for .env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const adminRoute = require("./routes/admin-router")
var app = express();

app.use('/order', orderRouter); // Mount the order route

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());

app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "hey hey hey"
}));


app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// lets define admin route
app.use("/admin",adminRoute)
//app.use('/order', orderRouter); // Mount the order route
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Middleware to parse JSON
app.use(express.json());
// If you need to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;
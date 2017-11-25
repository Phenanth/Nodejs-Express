var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var app = express();

var util = require('util');

/*
app.helpers({ //错误用法
  inspect: function(obj) {
    return util.insepect(obj, true);
  }
});

app.dynamicHelpers({
  headers: function(req, res) {
    return req.headers;
  }
});

app.get('/helper', function(req, res) {
  res.render('helper', {
    title: 'Helpers'
  });
});
*/

app.get('/', function(req, res) {
  res.render('index', {title: 'Express'});
});

app.get('/u:user', function(req, res) {

});

app.post('/post', function(req, res) {

});

app.get('/reg', function(req, res) {

});

app.post('/reg', function(req, res) {

});

app.get('/login', function(req, res) {

});

app.post('/reg', function(req, res) {

});

app.get('/logout', function(req, res) {

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(3000, function(){
	console.log('Express started on http://localhost:3000;');
});

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./dbSettings.js');
var routes = require('./routes/index');
var User = require('./models/user.js');

var app = express();

var util = require('util');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30 days
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://localhost/microblog'
  })
}));
/*
app.use(function(req, res, next) {
  req.locals.user = req.session.user;

  var error = req.flash('error');
  var success = req.flash('success');

  res.locals.error = error.length ? error : null;
  res.locals.succ = success.length ? success : null;

  next();
});
*/
// app.use(app.router);

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
  res.render('index', {
    title: 'Express',
    layout: 'layout'
  });
});

app.get('/u:user', function(req, res) {

});

app.post('/post', function(req, res) {

});

app.get('/reg', function(req, res) {
  res.render('reg', {
    title: '用户注册',
  });
});

app.post('/reg', function(req, res) {
  var name = req.body.name;
  var password = req.body.password;
  var password_repeat = req.body['password_repeat'];
  // 检验一致性
  if (password != password_repeat) {
    req.flash('error', '请校对两次密码是否一致');
    return res.redirect('/reg');
  }

  // 密码加密
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('hex');

  var newUser = new User({
    name: req.body.username,
    password: password
  });

  // 检查用户是否存在
  User.get(newUser.name, function(err, user) {
    if (user)
      err = 'User already exists.';
    if (err) {
      req.flash('error', err);
      return res.redirect('/reg');
    }

    newUser.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      console.log(newUser);
      req.session.user = newUser;
      req.flash('success', '注册成功');
      res.redirect('/');
    });
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/reg', function(req, res) {

});

app.get('/logout', function(req, res) {

});

// view engine setup 
// 实际上由于版本问题，使用bootstrap和jquery的引入不成功，没有样式上的改变
// 且ejs没有使用layout，没有footer等标签。


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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

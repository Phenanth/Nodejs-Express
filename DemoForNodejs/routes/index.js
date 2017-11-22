var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
	res.send('The local time is: ' + new Date().toString());
});

router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

var express = require('express');
var app = express();
var fortune = require('./lib/getFortune.js');

// handlebars视图引擎
var handlebars = require('express3-handlebars')
	.create({ defaultLayout: 'main'});
app.engine( 'handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// 幸运语录数组
var fortunes = [
	"Conquer your fears or they will conquer you.",
	"Rivers need springs.",
	"Do not fear what you don't know.",
	"You will have a pleasant surprise.",
	"Whenever possible, keep it simple.",
];

// 端口处理
app.set('port', process.env.PORT || 3000);

// 设置static中间件路径
app.use(express.static(__dirname + '/public'));

// 确认是否开启测试
app.use(function(req, res, next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});
 
// 设置网站路由
app.get('/', function(req, res){
// 这里express自带的get省去了简化url的步骤	var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase(); 的过程
	res.render('home');
});

app.get('/about', function(req, res){
	res.render('about', { 
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js' // 指明about视图应该使用哪个页面测试文件，与main layout中{{#if pageTestScript}}部分对应
	});
});

app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});

// 定制404界面-处理器
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 定制500界面-处理器
app.use(function(req, res){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' + app.get('port') + ' ; press Ctrl-C to terminate.');
});
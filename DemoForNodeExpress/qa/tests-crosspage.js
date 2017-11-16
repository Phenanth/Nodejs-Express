var Browser = require('zombie'),
	assert = require('assert');

var browser;

suite('Cross-Page Tests', function() {

	// 每次测试框架运行每个测试前都会运行setup()
	setup(function() {
		browser = new Browser();
	});

	test('requsting a group rate quote from the hood river tour page' + 'should populate the referrer field', function(done) {
		var referrer = 'http://localhost:3000/tours/hood-river';
		// 先检测1.是否来自产品页面 2.引用页是否正确
		// browser.visit()会加载页面，加载页面后就会调用回调函数
		// browser.clicklink()找到class为requestGroupRate的链接并访问
		browser.visit(referrer, function() {
			browser.clickLink('.requestGroupRate', function() {
				// 断言隐藏域referrer跟原来访问的页面是匹配的
			    // browser.field()返回一个DOM元素对象，具有value属性 
				// assert(browser.field('referrer').value === referrer);因为版本原因运行失败 下面这个丑一些的式子可以解决
				assert(browser.resources[0].request.headers._headers[0][1] === referrer);
                done();
			});
		});
	});

	test('requesting a group rate from the oregon coast tour page should' + 'populate the referrer field', function(done) {
		var referrer = 'http://localhost:3000/tours/oregon-coast';
		browser.visit(referrer, function() {
			browser.clickLink('.requestGroupRate', function() {
				assert(browser.field('referrer').value === referrer);// 断言测试因为版本问题 如今无法正常运行
				done();
			});
		});
	});

	// 最后一个测试确保直接访问Request Group Rate页面时referrer为空
	test('visitting the "request group rate" page directly should result' + ' in an empty referrer field', function(done) {
		browser.visit('http://localhost:3000/tours/request-group-rate', function() {
			assert(browser.field('referrer').value === '');
			done();
		});
	});
});
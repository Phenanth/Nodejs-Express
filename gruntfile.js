module.exports = function(grunt) {

	// 加载插件
	[
		'grunt-cafe-mocha',
		'grunt-contrib-jshint',
		'grunt-exec',
	].forEach(function(task){
		grunt.loadNpmTasks(task);
	});

	// 配置插件
	grunt.initConfig({
		cafemocha: {
			all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }, } // 指定是tdd界面
		},
		jshint: {
			app: ['web.js', 'public/js/**/*.js', 'lib/**/*.js'], // /**/指的是子目录中所有文件
			qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
		},
		exec: {
			linkchecker: { cmd: 'linkchecker http://localhost:3000' } // 日后可以把端口参数化
		},
	});

	// 注册任务
	grunt.registerTask('default', ['cafemocha', 'jshint', 'exec']); // 任务命名为default
};
suite('Global Tests', function(){
	test('page has a valid title', funcion(){
		assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
	});
});
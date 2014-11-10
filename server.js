var http = require('http'),
	static = require('node-static');

var fileServer = new static.Server('./build/dev/www', { cache: false, gzip: true });

var server = http.createServer(function(request, response) {
	request.addListener('end', function() {
		fileServer.serve(request, response);
	}).resume();
});
server.listen(8081);
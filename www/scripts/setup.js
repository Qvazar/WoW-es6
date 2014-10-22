requirejs.config({
    //baseUrl: 'scripts'
    paths: {
    	"engine": "wow-engine"
    }
});

require(['main'], function(main) {
	main();
});
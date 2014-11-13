export default function(executor) {
	var progressCbs = [];

	function doProgress(data) {
		setTimeout(function() {
			for (var cb of progressCbs) {
				cb(data);
			}			
		}, 0);
	}

	var p = new Promise((resolve, reject) => {
		return executor(resolve, reject, doProgress);
	});
	
	p = Object.create(p, {
		progress: {
			value: function(cb) {
				progressCbs.push(cb);
				return this;
			}
		}
	});

	return p;
};
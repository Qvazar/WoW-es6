function ProgressPromise(executor) {
	var progressCbs = [];

	function doProgress(data) {
		setTimeout(function() {
			for (var cb of progressCbs) {
				var r = cb(data);
				if (r !== undefined) {
					data = r;
				}
			}
		}, 0);
	}

	var p = new Promise((resolve, reject) => {
		return executor(resolve, reject, doProgress)
	});
	
	var pp = Object.create(p, {
		progress: {
			value: function(cb) {
				if (typeof cb === 'function') {
					progressCbs.push(cb);
				}

				return this;
			}
		},
		then: {
			value: function(onFulfilled, onRejected, onProgress) {
				this.progress(onProgress);

				return p.then(onFulfilled, onRejected);
			}
		}
	});

	return pp;	
}

export default ProgressPromise;
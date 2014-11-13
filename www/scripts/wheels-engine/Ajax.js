export default {
	get(responseType, url) {
		var progressCb = function(){};
		var p = new Promise((resolve, reject) => {
			this.getAll(responseType, url)
				.progress((e) => progressCb(e))
				.then((dataArray) => resolve(dataArray[0]))
				.catch(reject);
		});

		p.progress = function(cb) {
			progressCb = cb;
			return p;
		};

		return p;
	},

	getArrayBuffer(url) {
		return this.get('arraybuffer', url);
	},

	getBlob(url) {
		return this.get('blob', url);	
	},

	getJson(url) {
		return this.get('json', url);
	},

	getAll(responseType, ...urls) {
		var progressCb = function(){};

		var p = Promise.all(urls.map((url) => {
			return new Promise((resolve, reject) => {
				var request = new XMLHttpRequest();
				request.responseType = responseType;

				request.addEventListener('load', () => { resolve(request.response); });
				request.addEventListener('error', () => { reject({ status: request.status, text: request.statusText }); });
				request.addEventListener('abort', () => { reject({ status: request.status, text: request.statusText }); });
				request.addEventListener('progress', (e) => {
					if (e.lengthComputable) {
						progressCb({
							url: url,
							loaded: e.loaded,
							total: e.total
						});						
					}
				});

				request.open('GET', url, true);
				request.send();
			});			
		}));

		p.progress = function(cb) {
			progressCb = cb;
			return p;
		};

		return p;
	}
};
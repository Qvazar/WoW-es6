export default {
	get(responseType, url) {
		return new Promise((resolve, reject) => {
			this.getAll(responseType, url)
				.then((dataArray) => resolve(dataArray[0]))
				.catch(reject);
		});
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
		return Promise.all(urls.map((url) => {
			return new Promise((resolve, reject) => {
				var request = new XMLHttpRequest();
				request.responseType = responseType;

				request.addEventListener('load', () => { resolve(request.response); });
				request.addEventListener('error', () => { reject({ status: request.status, text: request.statusText }); });
				request.addEventListener('abort', () => { reject({ status: request.status, text: request.statusText }); });
				//request.addEventListener('progress', () => {  });

				request.open('GET', url, true);
			});			
		}));
	}
};
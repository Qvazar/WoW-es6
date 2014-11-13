import ProgressPromise from './ProgressPromise';

export default {
	get(responseType, ...urls) {
		if (urls.length === 0) {
			return Promise.resolve();
		}

		function loadFile(url) {
			return new ProgressPromise((resolve, reject, progress) => {
				var request = new XMLHttpRequest();
				request.responseType = responseType;

				request.addEventListener('load', () => { resolve(request.response); });
				request.addEventListener('error', () => { reject({ status: request.status, text: request.statusText }); });
				request.addEventListener('abort', () => { reject({ status: request.status, text: request.statusText }); });
				request.addEventListener('progress', (e) => progress(Object.create(e, { url: { value: url } })) );

				request.open('GET', url, true);
				request.send();
			});						
		}

		if (urls.length === 1) {
			return loadFile(urls[0]);
		} else {
			return urls.map(loadFile);
		}
	},

	getArrayBuffer(...urls) {
		return this.get('arraybuffer', ...urls);
	},

	getBlob(...urls) {
		return this.get('blob', ...urls);
	},

	getJson(...urls) {
		return this.get('json', ...urls);
	}
};
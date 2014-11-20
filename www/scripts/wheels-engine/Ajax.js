import ProgressPromise from './ProgressPromise';

function doRequest(method, url, responseType, data) {
	return new ProgressPromise((resolve, reject, progress) => {
		var request = new XMLHttpRequest();
		request.responseType = responseType;

		var onError = () => { reject({ status: request.status, text: request.statusText }); };

		request.addEventListener('load', () => { resolve(request.response); });
		request.addEventListener('error', onError);
		request.addEventListener('abort', onError);
		request.addEventListener('progress', (e) => progress(Object.create(e, { url: { value: url } })) );

		request.open(method, url, true);
		request.send(data);
	});
}

export default {
	get(responseType, ...urls) {
		if (urls.length === 0) {
			return Promise.resolve();
		}

		function loadFile(url) {
			return doRequest('GET', responseType, url);
		}

		if (urls.length === 1) {
			return loadFile(urls[0]);
		} else {
			return urls.map(loadFile);
		}
	},

	send(data, url, responseType) {
		return doRequest('POST', url, responseType, data);
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
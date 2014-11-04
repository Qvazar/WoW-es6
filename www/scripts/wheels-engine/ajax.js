export default {
	get(url, responseType) {
		return new Promise((resolve, reject) => {
			var request = new XMLHttpRequest();
			request.responseType = responseType;

			request.addEventListener('load', () => { resolve(request.response); });
			request.addEventListener('error', () => { reject({ request.status, request.statusText }); });
			request.addEventListener('abort', () => { reject({ request.status, request.statusText }); });
			//request.addEventListener('progress', () => {  });

			request.open('GET', url, true);
		});
	}
}
import Ajax from './Ajax';

class FileLibrary {
	constructor() {
		this.files = {};
	}

	*findFiles(regex) {
		for (f in this.files) if (this.files.hasOwnProperty(f)) {
			if (regex.test(f)) {
				yield f;
			}
		}
	}

	getBlob(filepath) {
		// TODO log 'file not found'
		var blob = this.files[filepath];
		return blob;
	}

	getDataUrl(filepath) {
		return new Promise((resolve, reject) => {
			var blob = getBlob(filepath);

			if (!blob) {
				reject({msg: 'File not loaded.'});
			}

			var url = blob.url;

			if (!url) {
				url = URL.createObjectUrl(blob);
				blob.url = url;
			}

			resolve(url);
		});
	}

	getArrayBuffer(filepath) {
		return new Promise((resolve, reject) => {
			var blob = getBlob(filepath);

			if (!blob) {
				reject({msg: 'File not loaded.'});
			}

			var buffer = blob.buffer;

			if (buffer) {
				resolve(buffer);
			} else {
				var reader = new FileReader();
				reader.onloadend = () => {
					buffer = reader.result;
					//blob.buffer = buffer;
					resolve(buffer);
				}
				reader.onerror = reject;

				reader.readAsArrayBuffer(blob);
			}
		});
	}

	getJson(filepath) {
		throw { msg: 'Not implemented.' };
	}

	setFile(filepath, blob) {
		this.files[filepath] = blob;
	}

	loadFiles(...filepaths) {
		return Promise.all(filepaths.map((filepath) => {
			return Ajax.getBlob(filepath)
				.then((blob) => {
					this.setFile(filepath, blob);
				});
		}));
	}

	loadPackages(...packagePaths) {
		return Promise.all(packagePaths.map((packagePath) => {
			return new Promise((resolve, reject) => {

				Ajax.getJson(packagePath + '.map.json')
					.then((packageDesc) => {

						Ajax.getBlob(packagePath + '.dat')
							.then((blob) => {

								for (var filepath in packageDesc.files) if (packageDesc.files.hasOwnProperty(filepath)) {
									var fileDesc = packageDesc.files[filepath],
										index = fileDesc.index,
										length = fileDesc.length;

									this.setFile(filepath, blob.slice(index, index + length));
								}

								resolve();
							})
							.catch(reject);

					})
					.catch(reject);

			});
		}));
	}
}

FileLibrary.create = () => new FileLibrary();

export default FileLibrary;
export const create = FileLibrary.create;
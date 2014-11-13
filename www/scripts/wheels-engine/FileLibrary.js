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
		return new Promise((resolve, reject) => {
			var blob = this.files[filepath];

			if (blob) {
				resolve(blob);
			} else {
				this.loadFiles(filepath)
				.then((blobs) => {
					resolve(blobs[0]);
				});
				.catch(reject);
		}
		});	
	}

	getDataUrl(filepath) {
		return new Promise((resolve, reject) => {
			this.getBlob(filepath)
			.then((blob) => {
				var url = blob.url;

				if (!url) {
					url = URL.createObjectUrl(blob);
					blob.url = url;
				}

				resolve(url);
			})
			.catch(reject);
		});
	}

	getArrayBuffer(filepath) {
		return new Promise((resolve, reject) => {
			this.getBlob(filepath)
			.then((blob) => {
				var reader = new FileReader();
				reader.onloadend = () => {
					var buffer = reader.result;
					//blob.buffer = buffer;
					resolve(buffer);
				}
				reader.onerror = reject;

				reader.readAsArrayBuffer(blob);
			})
			.catch(reject);
		});
	}

	getJson(filepath) {
		return new Promise((resolve, reject) => {
			this.getText(filepath)
			.then((text) => {
				try {
					var json = JSON.parse(text);
					resolve(json);	
				} catch (err) {
					reject(err);
				}
			})
			.catch(reject);
		});
	}

	getText(filepath) {
		return new Promise((resolve, reject) => {
			this.getBlob(filepath)
			.then((blob) => {
				var reader = new FileReader();
				reader.onloadend = () => {
					var text = reader.result;
					//blob.buffer = buffer;
					resolve(text);
				}
				reader.onerror = reject;

				reader.readAsText(blob);
			})
			.catch(reject);
		});
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
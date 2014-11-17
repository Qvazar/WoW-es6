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
		return this.files[filepath];
	}

	getDataUrl(filepath) {
		var blob = this.getBlob(filepath);
		var url = blob.url;

		if (!url) {
			url = URL.createObjectUrl(blob);
			blob.url = url;
		}

		return url;
	}

	getArrayBuffer(filepath) {
		return new Promise((resolve, reject) => {
			var blob = this.getBlob(filepath);
			var reader = new FileReader();

			reader.addEventListener('load', () => resolve(reader.result));
			reader.addEventListener('error', reject);

			reader.readAsArrayBuffer(blob);
		});
	}

	getJson(filepath) {
		return this.getText(filepath)
			.then((text) => JSON.parse(text));
	}

	getText(filepath) {
		return new Promise((resolve, reject) => {
			var blob = this.getBlob(filepath);
			var reader = new FileReader();

			reader.addEventListener('load', () => resolve(reader.result));
			reader.addEventListener('error', reject);

			reader.readAsText(blob);
		});
	}

	setFile(filepath, blob) {
		this.files[filepath] = blob;
	}

	loadFile(...filepaths) {
		if (filepaths.length === 0) {
			return Promise.resolve();
		}

		function doLoad(filepath) {
			if (this.files[filepath]) {
				return Promise.resolve(this.files[filepath]);
			} else {
				return Ajax.getBlob(filepath)
					.then((blob) => {
						this.setFile(filepath, blob);
						return blob;
					});
			}			
		}

		if (filepaths.length === 1) {
			return doLoad(filepaths[0]);
		} else {
			return filepaths.map(doLoad);
		}
	}

	loadPackages(...packagePaths) {
		return packagePaths.map((packagePath) => {

			return Ajax.getJson(packagePath + '.map.json')
				.then((packageDesc) => {

					return Ajax.getBlob(packagePath + '.dat')
						.then((blob) => {
							var r = {},
								files = packageDesc.files;

							for (var filepath in files) if (files.hasOwnProperty(filepath)) {
								var fileDesc = files[filepath],
									index = fileDesc.index,
									length = fileDesc.length,
									fileBlob = blob.slice(index, index + length);

								this.setFile(filepath, fileBlob);
								r[filepath] = fileBlob;
							}

							return r;
						})
				})
		});
	}
}

FileLibrary.create = () => new FileLibrary();

export default FileLibrary;
export const create = FileLibrary.create;
import Ajax from './Ajax';

class FileLibrary() {
	constructor() {
		this.files = {};
	}

	getFile(filepath) {
		return this.files[filepath];
	}

	loadFiles(...filepaths) {
		return Promise.all(filepaths.map((filepath) => {
			return Ajax.get('arraybuffer', filepath)
				.then((arrayBuffer) => {
					this.setFile(filepath, arrayBuffer);
				});
		}));
	}

	setFile(filepath, arrayBuffer) {
		this.files[filepath] = arrayBuffer;
	}

	loadPackages(...packagePaths) {
		return Promise.all(packagePaths.map((packagePath) => {
			return new Promise((resolve, reject) => {

				Ajax.getJson(packagePath)
					.then((packageDesc) => {

						Ajax.getArrayBuffer(packageDesc.packageUrl)
							.then((arrayBuffer) => {

								for (var filepath in packageDesc.files) if (packageDesc.files.hasOwnProperty(filepath)) {
									var fileDesc = packageDesc.files[filepath],
										index = fileDesc.index,
										length = fileDesc.length;

									files[filepath] = arrayBuffer.slice(index, index + length);
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
import Ajax from './Ajax';

function parsePackage(packageDesc, arrayBuffer) {
	var files = {};

	for (var filepath in packageDesc.files) if (packageDesc.files.hasOwnProperty(filepath)) {
		var index = packageDesc.files[filepath].index;
		var length = packageDesc.files[filepath].length;

		files[filepath] = arrayBuffer.slice(index, index+length);
	}

	return files;
}

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

							})
							.catch(reject);

					})
					.catch(reject);

			});
		}));
	}
}
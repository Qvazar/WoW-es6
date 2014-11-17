import ProgressPromise from './ProgressPromise';
import files from './di/files';

class Texture {
	constructor(url, width, height) {
		this.__url = url;
		this.__w = width;
		this.__h = height;
	}

	get url() { return this.__url; }
	get width() { return this.__w; }
	get height() { return this.__h; }
}

class TextureManager {
	constructor() {
		this.textures = {};
	}

	load(...texturePaths) {
		if (texturePaths.length === 0) {
			return Promise.resolve();
		}

		function loadTexture(texturePath) {
			var texture = this.textures[texturePath];

			if (texture) {
				return Promise.resolve(texture);
			} else {
				return new ProgressPromise((resolve, reject, progress) => {
					var url = files.getDataUrl(texturePath);
					var image = document.createElement('img');
					image.addEventListener('load', () => {
						var texture = new Texture(url, image.width, image.height);
						this.textures[texturePath] = texture;
						resolve(texture);
					});
					image.addEventListener('progress', (e) => progress(Object.create(e, { url: texturePath })));
					image.addEventListener('error', reject);

					image.src = url;
				});			
			}
		}

		if (texturePaths.length === 1) {
			return loadTexture(texturePaths[0]);
		} else {
			return texturePaths.map(loadTexture);
		}
	}

	getTexture(texturePath) {
		return this.textures[texturePath];
	}
}

TextureManager.create = (...args) => new TextureManager(...args);

export default TextureManager;
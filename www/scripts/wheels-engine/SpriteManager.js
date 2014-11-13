import ProgressPromise from './ProgressPromise';
import files from 'di/files';

class Sprite {
	constructor(url, width, height) {
		this.__url = url;
		this.__w = width;
		this.__h = height;
	}

	get url() { return this.__url; }
	get width() { return this.__w; }
	get height() { return this.__h; }
}

class SpriteManager {
	constructor() {
		this.sprites = {};
	}

	load(...spritePaths) {
		if (spritePaths.length === 0) {
			return Promise.resolve();
		}

		function loadSprite(spritePath) {
			var sprite = this.sprites[spritePath];

			if (sprite) {
				return Promise.resolve(sprite);
			} else {
				return new ProgressPromise((resolve, reject, progress) => {
					return files.getDataUrl(spritePath).then((url) => {
						var image = document.createElement('img');
						image.addEventListener('load', () => {
							var sprite = new Sprite(url, image.width, image.height);
							this.sprites[spritePath] = sprite;
							resolve(sprite);
						};
						image.addEventListener('progress', (e) => progress(Object.create(e, { url: spritePath })));
						image.addEventListener('error', reject);

						image.src = url;
					});
				});			
			}
		}

		if (spritePaths.length === 1) {
			return loadSprite(spritePaths[0]);
		} else {
			return spritePaths.map(loadSprite);
		}

		
		});
	}

	getSprite(spritePath) {
		return this.sprites[spritePath];
	}
}
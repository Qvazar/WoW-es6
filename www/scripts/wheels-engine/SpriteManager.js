import config from './config';

var files = config.files;

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
		return Promise.all(spritePaths.map((spritePath) => {
			return new Promise((resolve, reject) => {
				files.getDataUrl(spritePath).then((url) => {
					var image = document.createElement('img');
					image.onload = () => {
						var sprite = new Sprite(url, image.width, image.height);
						this.sprites[spritePath] = sprite;
						resolve(sprite);
					};
					image.onerror = reject;

					image.src = url;
				});
			});
		}));
	}

	getSprite(spritePath) {
		var sprite = this.sprites[spritePath];
		// TODO logging
		return sprite;
	}
}
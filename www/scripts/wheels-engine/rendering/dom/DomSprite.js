import ObjectPool from '../../ObjectPool';
import DomWrapper from './DomWrapper';
import Transformation from '../../Transformation';
import textures from '../../di/textures';

class DomSprite {
	constructor(rendererApi, settings) {

		settings.textures = settings.textures || [];
		settings.animationDelay = settings.animationDelay || 1 / 25;
		settings.looping = !!settings.looping;
		settings.disposeOnEnd = !!settings.disposeOnEnd;

		this.settings = settings;
		this.domElement = document.createElement('img');

		this.__transformation = Transformation.create();
		this.__transformationChanged = false;
		this.__rendererApi = rendererApi;
		this.__textureData = settings.textures.map((path) => textures.getTexture(path));
		this.__age = 0;
		this.__element = new DomWrapper(this.domElement);
		this.__currentTextureIndex = -1;
	}

	get transformation() { return this.__transformation; }

	set transformation(value) {
		if (this.__transformation !== value) {
			this.__transformation = value;
			this.__transformationChanged = true;
		}
	}

	dispose() {
		var e = this.domElement,
			p = e.parentElement;

		if (p) {
			p.removeChild(e);
		}

		this.domElement.src = "";
		this.__rendererApi.remove(this);
	}

	clone() {
		return DomSprite.create(this.settings);
	}

	render(args) {
		var delta = args.delta,
			age = this.__age += delta,
			animDelay = this.settings.animationDelay,
			textures = this.__textureData,
			textureIndex = (age / animDelay) % textures.length,
			prevTextureIndex = this.__currentTextureIndex;

		if (textureIndex != prevTextureIndex) {
			this.__currentTextureIndex = textureIndex;
			var newTexture = textures[textureIndex],
				setAttrs = {'src': newTexture.url };

			if (prevTextureIndex < 0) {
				setAttrs['width'] = newTexture.width;
				setAttrs['height'] = newTexture.height;
			} else {
				var prevTexture = textures[prevTextureIndex];

				if (newTexture.width != prevTexture.width) {
					setAttrs['width'] = newTexture.width;
				}

				if (newTexture.height != prevTexture.height) {
					setAttrs['width'] = newTexture.width;
				}
			}

			this.__element.set(setAttrs);
		}

		if (this.__transformationChanged) {
			this.__transformationChanged = false;
			css.setTransform(this.__element, this.__transformation);
		}
	}
}

DomSprite.create = ObjectPool(DomSprite);

export default DomSprite;
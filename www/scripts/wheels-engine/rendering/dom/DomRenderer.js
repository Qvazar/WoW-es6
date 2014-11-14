import DomSprite from './DomSprite';
import Transformation from '../../Transformation';

function createElement() {
	var view = document.createElement('div');
	view.classList.add('dom-renderer-view');

	var root = document.createElement('div');
	root.classList.add('dom-renderer-root');

	view.appendChild(root);

	return view;
}

class DomRenderer {
	constructor() {
		this.viewTransformation = Transformation.create();
		this.__viewElement = createElement();
		this.__rootElement = this.__viewElement.firstChild;
	}

	get domElement {
		return this.__viewElement;
	}

	createSprite(...texturePaths) {
		var sprite = DomSprite.create(textures);
		this.__rootElement.appendChild(sprite.domElement);
		return sprite;
	}
}

DomRenderer.create = () => new DomRenderer();

export default DomRenderer;
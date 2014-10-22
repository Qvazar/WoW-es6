import Transformation from './Transformation';
import css from './css';

function createHtml() {
	var viewport = document.createElement('div'),
		root = document.createElement('div');

	viewport.classList.add('viewport');
	root.classList.add('viewport-root');
	viewport.appendChild(root);
}

class Viewport {
	constructor() {
		var html = createHtml();

		this.__viewportElement = html;
		this.__rootElement = html.firstChild;
		this.__transformation = Transformation.identity;
	}

	get viewportElement() {
		return this.__viewportElement;
	}

	get rootElement() {
		return this.__rootElement;
	}

	get transformation() { return this.__transformation; }

	set transformation(transformation) {
		this.__transformation = transformation;

		css.setTransform(this.__rootElement, transformation);
	}
}

Viewport.create = (...args) => new Viewport(...args);

export default Viewport;
export const create = Viewport.create;
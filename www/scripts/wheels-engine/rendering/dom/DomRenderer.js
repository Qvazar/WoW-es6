import DomSprite from './DomSprite';
import Transformation from '../../Transformation';
import css from '../../css';

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
		this.__viewElement = createElement();
		this.__rootElement = this.__viewElement.firstChild;

		var renderables = [];
		this.__renderables = renderables;
		this.__renderableApi = {
			add(renderable) { renderables.push(renderable); },
			remove(renderable) { renderables.splice(renderables.indexOf(renderable), 1); }
		}

		this.__viewTransformation = Transformation.create();
	}

	get domElement {
		return this.__viewElement;
	}

	get viewTransformation() { return this.__viewTransformation; }

	set viewTransformation(value) {
		this.__viewTransformation = value;
		css.setTransform(this.__rootElement, value);
	}

	createSprite(settings) {
		var sprite = DomSprite.create(this, settings);
		this.__rootElement.appendChild(sprite.domElement);
		this.__renderables.push(sprite);
		return sprite;
	}

	render(args) {
		for (var r of this.__renderables) {
			r.render(args);
		}
	}
}

DomRenderer.create = () => new DomRenderer();

export default DomRenderer;
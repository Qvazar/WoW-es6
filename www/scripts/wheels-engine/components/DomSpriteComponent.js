import Component from './Component';
import Transformation from '../Transformation';
import css from '../css';
import config from '../config';

var sprites = config.sprites;

var ELEMENT_CLASS = 'dom-sprite-component';
css.createStyle(ELEMENT_CLASS, '')

class DomSpriteComponent extends Component {
	/**
	 * settings: {
	 *	element: A HTML element, string, or a function for creating the HTML element.
	 *	sprites: The sprite names to animate through
	 *	css: css attributes to apply
	 *	cssClass: space-delimited list of css classes to apply
	 * }
	 */
	constructor(settings) {
		super();

		if (!this.settings) {
			throw { msg: 'No settings defined.' };
		}

		this.settings = settings;
		this.__element = null;
		this.__deltaTransform = null;
		this.__oldEntityTransform = null;
		this.__renderFn = null;
		this.__spriteIndex = 0;
	}

	init(scene, entity) {
		super(scene, entity);

		this.__element = this.createElement();
		this.insertElement();
	}

	dispose() {
		this.removeElement();
		this.__element = null;
	}

	clone() {
		var c = DomSpriteComponent.create(this.settings);
		return c;
	}

	createElement() {
		var e,
			settingsElement = this.settings.element;

		switch (typeof(settingsElement)) {
			case 'string':
				var tmp = document.createElement('div');
				tmp.insertAdjacentHTML('beforeend', settingsElement);
				e = tmp.firstChild;
			break;
			case 'function':
				e = settingsElement();
			break;
			case 'undefined':
				e = document.createElement('div');
			break;
			default:
				e = settingsElement;
			break;
		}

		e.classList.add(ELEMENT_CLASS);

		if (this.settings.css) {
			for (css in this.settings.css) if (this.settings.css.hasOwnProperty(css)) {
				e.style[css] = this.settings.css[css];
			}
		}

		if (this.settings.cssClass) {
			e.classList.add.apply(e.classList, this.settings.cssClass.split(' '));
		}

		return e;
	}

	insertElement() {
		if (this.__element) {
			var parent = this.entity.parent && this.entity.parent.get('dom:element');

			if (parent) {
				parent.appendChild(this.__element);
			}
		}
	}

	removeElement() {
		var e = this.__element,
			p;

		if (e && (p = e.parentNode)) {
			p.removeChild(e);
		}
	}

	update(args) {
		var newTransformation = this.entity.transformation,
			oldTransformation = this.__oldEntityTransform,
			e = this.__element;

		this.__oldEntityTransform = newTransformation;
		//this.__deltaTransform = newTransformation.subtract(oldTransformation);

		if (oldTransformation) {
			// Start a CSS animation to move from oldT to newT
			this.__renderFn = () => {
				css.animateTransform(e, oldTransformation, newTransformation, 1 / args.frequency);
			}
		} else {
			// Just set to newT
			this.__renderFn = () => {
				css.setTransform(e, newTransformation);
			}
		}

		var spriteIndex = this.__spriteIndex,
			sprite = sprites.getSprite(this.settings.sprites[spriteIndex]);

		this.spriteIndex = (spriteIndex + 1) % this.settings.sprites.length;

		css.setProperty(e, 'background-image', `url(${sprite.url})`);
		css.setProperty(e, 'width', sprite.width);
		css.setProperty(e, 'height', sprite.height);
	}

	render(args) {
		if (this.__renderFn) {
			this.__renderFn();
			this.__renderFn = null;
		}
	}
}

import createFactory from '../ObjectPool'

DomSpriteComponent.create = createFactory(DomSpriteComponent);

export default DomSpriteComponent;
export const create = DomSpriteComponent.create;
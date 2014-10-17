import Component from './Component';
import Transformation from '../Transformation';

class DomComponent {
	/**
	 * settings: {
	 *	element: A HTML element, string, or a function for creating the HTML element.
	 * }
	 */
	constructor(settings) {
		super();

		if (!this.settings || !this.settings.element) {
			throw { msg: 'No element defined in settings.' };
		}

		this.settings = settings;
		this.__element = null;
		this.__deltaTransform = null;
		this.__oldEntityTransform = null;
	}

	init(entity) {
		super(entity);

		this.__element = this.createElement();
		entity.msgbus.set('dom:element', () => this.__element);

		this.insertElement();
	}

	dispose() {
		this.removeElement();
		this.__element = null;
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
			default:
				e = settingsElement;
			break;
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
			
		} else {
			// Just set to newT
			css.transform(e, newTransformation);
		}

		
	}

	render(args) {
		// var deltaTransform = this.__deltaTransform * args.alpha,
		// 	absoluteTransform = this.__oldEntityTransform.add(deltaTransform),
		// 	e = this.__element;


	}
}

import createFactory from '../ObjectPool'

DomComponent.create = createFactory(DomComponent);

export default DomComponent;
export const create = DomComponent.create;
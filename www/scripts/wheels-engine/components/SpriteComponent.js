import Component from './Component';
import Transformation from '../Transformation';
import css from '../css';
import renderer from '../di/renderer';

var ELEMENT_CLASS = 'dom-sprite-component';
css.createStyle(ELEMENT_CLASS, '')

class SpriteComponent extends Component {
	/**
	 * settings: {
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

		this.sprite = renderer.createSprite(settings);
	}

	init(scene, entity) {
		super(scene, entity);
	}

	dispose() {
		this.sprite.dispose();
	}

	clone() {
		var c = SpriteComponent.create(this.settings);
		return c;
	}

	update(args) {
		this.sprite.transformation = this.entity.transformation;
	}

	render(args) {

	}
}

import createFactory from '../ObjectPool'

SpriteComponent.create = createFactory(SpriteComponent);

export default SpriteComponent;
export const create = SpriteComponent.create;
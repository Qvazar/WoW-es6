import Component from './Component';
import SoundManager from '../SoundManager';

class SoundOnEventComponent extends Component {

	constructor(settings) {
		this.settings = Object.freeze(settings);
		this.play = this.play.bind(this);
		this.stop = this.stop.bind(this);
	}

	init(scene, entity) {
		super(scene, entity);

		this.entity.msgbus.on(this.settings.event, this.play);
	}

	dispose() {
		this.entity.msgbus.off(this.settings.event, this.play);
		super();
	}

	play() {
		var e = this.entity.getComponent(this.settings.component).element;
		if (e) {
			e.addEventListener("animationend", this.stop);
			e.classList.add(this.settings.animationName);
		}
	}
}

import createFactory from '../ObjectPool'

SoundOnEventComponent.create = createFactory(SoundOnEventComponent);

export default SoundOnEventComponent;
export const create = SoundOnEventComponent.create;
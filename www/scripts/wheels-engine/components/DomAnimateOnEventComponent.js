import Component from './Component';

class DomAnimateOnEventComponent extends Component {

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
		this.stop();

		var e = this.entity.getComponent(this.settings.component).element;
		if (e) {
			e.addEventListener("animationend", this.stop);
			e.classList.add(this.settings.animationName);
		}
	}

	stop(event) {
		if (event && event.animationName !== this.settings.animationName) {
			return;
		}

		var e = this.entity.getComponent(this.settings.component).element;
		if (e) {
			e.removeEventListener("animationend", this.stop);
			e.classList.remove(this.settings.animationName);
		}
	}
}

import createFactory from '../ObjectPool'

DomAnimateOnEventComponent.create = createFactory(DomAnimateOnEventComponent);

export default DomAnimateOnEventComponent;
export const create = DomAnimateOnEventComponent.create;
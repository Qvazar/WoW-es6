import Component from './Component';

class DomAnimateOnEventComponent extends Component {

	constructor(settings) {
		this.settings = Object.freeze(settings);
		this.animate = this.animate.bind(this);
		this.stopAnimation = this.stopAnimation.bind(this);
	}

	init(scene, entity) {
		super(scene, entity);

		this.entity.msgbus.on(this.settings.event, this.animate);
	}

	dispose() {
		this.entity.msgbus.off(this.settings.event, this.animate);
		super();
	}

	animate() {
		var e = this.entity.getComponent(this.settings.component).element;
		if (e) {
			e.addEventListener("animationend", this.stopAnimation);
			e.classList.add(this.settings.animationName);
		}
	}

	stopAnimation(event) {
		if (event && event.animationName !== this.settings.animationName) {
			return;
		}

		var e = this.entity.getComponent(this.settings.component).element;
		if (e) {
			e.removeEventListener("animationend", this.stopAnimation);
			e.classList.remove(this.settings.animationName);
		}
	}
}

import createFactory from '../ObjectPool'

DomAnimateOnEventComponent.create = createFactory(DomAnimateOnEventComponent);


export default DomAnimateOnEventComponent;
export const create = DomAnimateOnEventComponent.create;
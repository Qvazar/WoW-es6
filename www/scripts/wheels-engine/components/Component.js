export default class Component {
	constructor() {
		this.scene = null;
		this.entity = null;
	}

	init(scene, entity) {
		this.scene = scene;
		this.entity = entity;
	}

	dispose() {
		this.entity = entity;
	}

	update(args) {

	}

	render(args) {

	}
}
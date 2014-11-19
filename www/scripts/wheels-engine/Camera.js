import Transformation from './Transformation';

class Camera {
	constructor(renderer) {
		this.__renderer = renderer;
	}

	get transformation() {
		return this.__renderer.viewTransformation;
	}

	set transformation(value) {
		this.__renderer.viewTransformation = value;
	}
}

Camera.create = (...args) => new Camera(...args);

export default Camera;
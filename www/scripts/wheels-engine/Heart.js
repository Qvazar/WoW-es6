class Heart {
	constructor() {
		this.__pulseCb = () => {};
	}

	start() {
		throw { msg: 'Not implemented.' };
	}

	stop() {
		throw { msg: 'Not implemented.' };
	}

	pulse() {
		this.__pulseCb();
	}

	onPulse(cb) {
		if (typeof cb === 'function') {
			this.__pulseCb = cb;
		} else {
			this.__pulseCb = () => {};
		}
	}
}

export default Heart;
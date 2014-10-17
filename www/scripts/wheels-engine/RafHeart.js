import Heart from './Heart';
//import requestAnimationFrame from 'requestAnimationFrame';

class RafHeart extends Heart {
	constructor() {
		super();
		this.isBeating = false;
	}

	start() {
		var cb = () => {
			if (this.isBeating) {
				requestAnimationFrame(cb);
			}

			this.pulse();
		};

		this.isBeating = true;
		cb();
	}

	stop() {
		this.isBeating = false;
	}
}

export default RafHeart;
import Ajax from './ajax';
import ObjectPool from './ObjectPool';
import Transformation from './Transformation';

class Sound {
	constructor(audioBuffer, context) {
		this.audioBuffer = audioBuffer;
		this.context = context;
		this.volume = 1;
		this.position = Transformation.create();
	}

	dispose() {
		this.audioBuffer = null;
		this.context = null;
		this.volume = 1;
		this.position = null;
	}

	play() {
		return new Promise((resolve, reject) => {
			var bufferSourceNode = context.createBufferSource(),
				gainNode = context.createGain(),
				pannerNode = context.createPanner();

			bufferSourceNode.buffer = audioBuffer;

			gainNode.gain.value = this.volume;
			pannerNode.setPosition(this.position.x, this.position.y, 0);

			bufferSourceNode.connect(gain);
			gainNode.connect(panner);
			pannerNode.connect(context.destination);

			bufferSourceNode.onended = () => {
				pannerNode.disconnect();
				gainNode.disconnect();
				bufferSource.disconnect();

				resolve();
			};

			bufferSourceNode.start();
		});
	}
}

Sound.create = ObjectPool.create(Sound);

class SoundManager {
	constructor(cfg) {
		var AudioContext = (window.AudioContext || window.webkitAudioContext);

		if (!AudioContext) {
			throw { msg: 'AudioContext not implemented by client.' };
		}

		this.context = new AudioContext();
		this.audioBuffers = {};
	}

	load(...soundFiles) {
		return Promise.all(soundFiles.map((soundFile) => {
			return new Promise((resolve, reject) => {

				if (this.audioBuffers[soundFile]) {
					resolve(Sound.create(this.audioBuffers[soundFile], this.context));
				} else {
					Ajax.get(soundFile, 'arraybuffer')
						.then((arrayBuffer) => {

							this.context.decodeAudioData(
								arrayBuffer,
								(audioBuffer) => {
									this.audioBuffers[soundFile] = audioBuffer;

									resolve(Sound.create(audioBuffer, this.context));
								},
								reject);

						})
						.catch(reject);
				}
			});
		}));
	}

	getSound(soundFile) {
		var audioBuffer = this.audioBuffers[soundFile];
		if (!audioBuffer) {
			//TODO logging
		}

		return Sound.create(audioBuffer, this.context);
	}

	play(soundFile, volume, position) {
		var sound = this.getSound(soundFile);
		sound.volume = volume;
		sound.position = position;
		return sound.play().then(() => sound.dispose());
	}
}

SoundManager.create = (...args) => new SoundManager(...args);

export default SoundManager;
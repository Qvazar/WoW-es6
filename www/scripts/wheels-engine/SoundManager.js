import files from 'di/files';
import createObjectPool from './ObjectPool';
import Transformation from './Transformation';

var noop = () => {};

class Sound {
	constructor(audioBuffer, context, destination) {
		this.audioBuffer = audioBuffer;
		this.context = context;
		this.destination = destination;
		this.volume = 1;
		this.position = Transformation.create();
		this.loop = false;
	}

	dispose() {
		this.stop();
		this.audioBuffer = null;
		this.context = null;
		this.volume = 1;
		this.position = null;
		this.destination = null;
	}

	play() {
		return new Promise((resolve, reject) => {
			var bufferSourceNode = context.createBufferSource(),
				gainNode = context.createGain(),
				pannerNode = context.createPanner();

			bufferSourceNode.buffer = this.audioBuffer;
			bufferSourceNode.loop = this.loop;

			gainNode.gain.value = this.volume;

			if (this.position) {
				pannerNode.setPosition(this.position.x, this.position.y, 0);
			}

			bufferSourceNode.connect(gain);
			gainNode.connect(panner);
			pannerNode.connect(this.destination);

			bufferSourceNode.onended = () => {
				pannerNode.disconnect();
				gainNode.disconnect();
				bufferSource.disconnect();

				this.stop = noop;

				resolve();
			};

			this.stop = () => { bufferSourceNode.stop(); };
			bufferSourceNode.start();
		});
	}

	stop: noop
}

Sound.create = createObjectPool(Sound);

class SoundManager {
	constructor() {
		var AudioContext = (window.AudioContext || window.webkitAudioContext);

		if (!AudioContext) {
			throw { msg: 'AudioContext not implemented by client.' };
		}

		this.context = new AudioContext();
		this.gainNode = this.context.createGain();
		this.destination = this.gainNode;
		this.audioBuffers = {};

		this.gainNode.connect(this.context.destination);
	}

	set volume(value) {
		this.gainNode.gain.value = value;
	}

	get volume() {
		return this.gainNode.gain.value;
	}

	load(...soundFiles) {
		return Promise.all(soundFiles.map((soundFile) => {
			return new Promise((resolve, reject) => {

				if (this.audioBuffers[soundFile]) {
					resolve(Sound.create(this.audioBuffers[soundFile], this.context, this.destination));
				} else {
					files.getArrayBuffer(soundFile + '.mp3')
						.then((arrayBuffer) => {

							this.context.decodeAudioData(
								arrayBuffer,
								(audioBuffer) => {
									this.audioBuffers[soundFile] = audioBuffer;

									resolve(Sound.create(audioBuffer, this.context, this.destination));
								},
								reject);

						})
						.catch(reject);
				}
			});
		}));
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
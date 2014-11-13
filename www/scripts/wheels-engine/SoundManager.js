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
		
		this.stop = noop;
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

			bufferSourceNode.connect(gainNode);
			gainNode.connect(pannerNode);
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
		if (soundFiles.length === 0) {
			return Promise.resolve();
		}

		function loadSound(soundFile) {
			if (this.audioBuffers[soundFile]) {
				return Promise.resolve(Sound.create(this.audioBuffers[soundFile], this.context, this.destination));
			} else {
				return files.getArrayBuffer(soundFile + '.mp3')
					.then((arrayBuffer) => {
						return new Promise((resolve, reject) {

							this.context.decodeAudioData(
								arrayBuffer,
								(audioBuffer) => {
									this.audioBuffers[soundFile] = audioBuffer;

									resolve(Sound.create(audioBuffer, this.context, this.destination));
								},
								reject);

						});
					})
			}			
		}

		if (soundFiles.length === 1) {
			return loadSound(soundFiles[0]);
		} else {
			return soundFiles.map(loadSound);
		}
	}

	getSound(soundFile) {
		return Sound.create(this.audioBuffers[soundFile], this.context, this.destination);
	}

	play(soundFile, volume, position) {
		return this.getSound(soundFile).then((sound) => {
			sound.volume = volume;
			sound.position = position;
			return sound.play().then(() => sound.dispose());
		});
	}
}

SoundManager.create = (...args) => new SoundManager(...args);

export default SoundManager;
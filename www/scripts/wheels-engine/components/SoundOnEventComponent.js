import Component from './Component';
import audio from 'di/audio';

class SoundOnEventComponent extends Component {

	constructor(settings) {
		this.settings = Object.freeze(settings);
		this.play = this.play.bind(this);
		this.stop = this.stop.bind(this);
		this.sound = audio.getSound(this.settings.sound);
	}

	init(scene, entity) {
		super(scene, entity);

		this.entity.msgbus.on(this.settings.event, this.play);
	}

	dispose() {
		this.entity.msgbus.off(this.settings.event, this.play);
		this.sound.dispose();
		this.sound = null;
		super();
	}

	play() {
		var snd = this.sound;
		snd.volume = this.settings.volume;
		snd.position = this.entity.transformation;
		return this.sound.play();
	}

	stop() {
		this.sound.stop();
	}
}

import createFactory from '../ObjectPool'

SoundOnEventComponent.create = createFactory(SoundOnEventComponent);

export default SoundOnEventComponent;
export const create = SoundOnEventComponent.create;
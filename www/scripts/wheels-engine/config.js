import EntityFactory from './EntityFactory';
import SoundManager from './SoundManager';

/**
 * config:
 *	components: component config
 */	
function setup(config) {
	setupEntityFactory.call(this, config.entities);
	setupSound.call(this, config.sound);
}

function setupEntityFactory(entityCfg) {
	this.entityFactory = EntityFactory.create(componentsCfg);
}

function setupAudio(soundCfg) {
	this.soundManager = SoundManager.create(soundCfg);
}

var config = {
	setup: setup
};

export default config;
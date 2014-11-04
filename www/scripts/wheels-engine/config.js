import EntityFactory from './EntityFactory';
import AudioManager from './AudioManager';

/**
 * config:
 *	components: component config
 */	
function setup(config) {
	setupEntityFactory.call(this, config.entities);
	setupAudio.call(this, config.audio);
}

function setupEntityFactory(entityCfg) {
	this.entityFactory = EntityFactory.create(componentsCfg);
}

function setupAudio(audioCfg) {
	this.audioManager = AudioManager.create(audioCfg);
}

var config = {
	setup: setup
};

export default config;
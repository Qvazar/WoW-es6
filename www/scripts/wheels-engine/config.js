import EntityFactory from './EntityFactory';
import SoundManager from './SoundManager';
import FileLibrary from './FileLibrary';
import SpriteManager from './SpriteManager';

/**
 * config:
 *	components: component config
 */	
function setup(config) {
	setupFiles.call(this, config.files);
	setupSound.call(this, config.sound);
	setupSprites.call(this, config.sprites);
	setupEntityFactory.call(this, config.entities);
}

function setupEntityFactory(entityCfg) {
	this.entityFactory = EntityFactory.create(componentsCfg);
}

function setupAudio(soundCfg) {
	this.soundManager = SoundManager.create(soundCfg);
}

function setupFiles(filesCfg) {
	this.files = FileLibrary.create(filesCfg);
}

function setupSprites(cfg) {
	this.sprites = SpriteManager.create(cfg);
}

var config = {
	setup: setup
};

export default config;
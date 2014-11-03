import EntityFactory from './EntityFactory';

/**
 * config:
 *	components: component config
 */	
function setup(config) {
	setupEntityFactory.call(this, config.components);
}

function setupEntityFactory(componentsCfg) {
	this.entityFactory = EntityFactory.create(componentsCfg);
}

var config = {
	setup: setup
};

export default config;
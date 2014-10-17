import Entity from './Entity';

class Scene extends Entity {
	constructor(...args) {
		super(...args);
	}
	
	enter() {
		this.game.msgbus.send('scene:enter', this);
	}

	exit() {
		this.game.msgbus.send('scene:exit', this);
	}
}

export default Scene;
import {create as msgbusFactory} from './MessageBus';

class Game {
	// settings: {
	// 		heart: A Heart instance
	//		updateFreq: hz of updates
	// }
	constructor(settings) {
		this.msgbus = msgbusFactory();
		this.settings = settings;
		this.__scenes = [];
	}

	start() {
		var heart = this.settings.heart;
		if (!heart) {
			throw { msg: 'Game cannot start without a heart.' };
		}

		heart.onPulse(() => {
			// Update
			// Render
		});

		heart.start();
	}

	update(args) {
		this.__scenes.forEach((s) => s.update(args));
	}

	render(args) {
		this.__scenes.forEach((s) => s.render(args));
	}

	pushScene(scene) {
		var oldScene = this.__scenes[this.__scenes.length - 1];
		this.__scenes.push(scene);

		scene.game = this;

		oldScene.exit();
		scene.enter();
	}

	popScene() {
		var oldScene = this.__scenes.pop(),
			newScene = this.__scenes[this.__scenes.length - 1];

		oldScene.exit();
		oldScene.game = null;

		if (newScene) {
			newScene.enter();
		}
	}
}

export default Game;
export const create = () => new Game();
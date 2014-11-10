import {create as msgbusFactory} from './MessageBus';

class Game {
	// settings: {
	// 		heart: A Heart instance
	//		updateFreq: hz of updates
	// }
	constructor(settings) {
		this.msgbus = msgbusFactory();
		this.settings = settings || {};
		this.__scenes = [];
		this.__updateArgs = {};
		this.__renderArgs = {};
	}

	start() {
		var heart = this.settings.heart;
		if (!heart) {
			throw { msg: 'Game cannot start without a heart.' };
		}

		var updateArgs = this.__updateArgs,
			renderArgs = this.__renderArgs,
			updateDeltaMs = 1000 / this.settings.updateFreq,
			now = Date.now(),
			lastUpdateTime = now;

		updateArgs.frequency = this.settings.updateFreq;
		updateArgs.step = 0;

		renderArgs.step = 0;

		heart.onPulse(() => {
			now = Date.now();

			var updateCount = Math.floor((now - lastUpdateTime) / updateDeltaMs);
			while (updateCount-- > 0) {
				updateArgs.step += 1;
				console.log('Update step ' + updateArgs.step);
				this.update(updateArgs);
				lastUpdateTime = now;
			}

			renderArgs.step += 1;
			console.log('Render step ' + renderArgs.step);

			this.render(renderArgs);
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

Game.create = (...args) => new Game(...args);

export default Game;
export const create = Game.create;
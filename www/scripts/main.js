import Game from 'engine/Game';
import Viewport from 'engine/Viewport';
import RafHeart from 'engine/RafHeart';

export default () => {
	var viewport = Viewport.create();
	var game = Game.create({
		heart: RafHeart.create(),
		updateFreq: 20
	});

	document.getElementById('game').appendChild(viewport.viewportElement);

	game.start();
};
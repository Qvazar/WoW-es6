import Game from 'wheels-engine/Game';
import Viewport from 'wheels-engine/Viewport';
import RafHeart from 'wheels-engine/RafHeart';

export default () => {
	var viewport = Viewport.create();
	var game = Game.create({
		heart: RafHeart.create(),
		updateFreq: 20
	});

	document.getElementById('game').appendChild(viewport.viewportElement);

	game.start();
};
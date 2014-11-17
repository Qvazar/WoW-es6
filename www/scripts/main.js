import Game from 'wheels-engine/Game';
import RafHeart from 'wheels-engine/RafHeart';

export default () => {
	var game = Game.create({
		heart: RafHeart.create(),
		updateFreq: 20
	});

	document.getElementById('game').appendChild(game.viewportElement);

	game.start();
};
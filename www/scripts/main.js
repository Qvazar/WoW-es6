import Game from 'wheels-engine/Game';
import RafHeart from 'wheels-engine/RafHeart';
import Transformation from './wheels-engine/Transformation';

export default () => {
	var game = Game.create({
		heart: RafHeart.create(),
		updateFreq: 20
	});

	document.getElementById('game').appendChild(game.viewportElement);

	game.start();

	var i = 0;
	var dTr = Transformation.create(0, 0, 1, 0);
	setInterval(function() {
		game.camera.transformation = game.camera.transformation.add(dTr);
	}, 20);
};
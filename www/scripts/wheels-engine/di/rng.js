import MersenneTwister from 'MersenneTwister';

var twister = new MersenneTwister();

var rng = {
	int() { return twister.int(); },
	float() { return twister.rnd(); }
};

export default rng;
export const setup = function(seed) {
	twister = new MersenneTwister(seed);
};
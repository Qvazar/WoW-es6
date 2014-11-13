import rng from 'di/rng';

class Range {
	constructor(from, to) {
		this.__from = (from !== undefined) ? from : 0;
		this.__to = (to !== undefined) ? to : 1;
	}

	get from() { return this.__from; }
	get to() { return this.__to; }

	random() {
		return rng(from, to);
	}
}

import ObjectPool from './ObjectPool';

Range.create = ObjectPool(Range);

export default Range;
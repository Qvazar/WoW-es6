

class Transformation {
	constructor(x, y, r, s) {
		this.__x = x || 0;
		this.__y = y || 0;
		this.__r = r || 0;
		this.__s = s || 1;

		//Object.seal(this);
	}

	get x() { return this.__x; };
	get y() { return this.__y; };
	get r() { return this.__r; };
	get s() { return this.__s; };

	dispose() {

	}

	add(transformation) {
		var x = this.x += transformation.x,
			y = this.y += transformation.y,
			r = this.r += transformation.r,
			s = this.s *= transformation.s;

		return Transformation.create(x, y, r, s);
	}

	subtract(transformation) {
		var x = this.x -= transformation.x,
			y = this.y -= transformation.y,
			r = this.r -= transformation.r,
			s = this.s /= transformation.s;

		return Transformation.create(x, y, r, s);		
	}

	multiply(multiplier) {
		var x = this.x *= multiplier,
			y = this.y *= multiplier,
			r = this.r *= multiplier,
			s = this.s *= multiplier;

		return Transformation.create(x, y, r, s);
	}

	negate() {
		var x = this.x * -1,
			y = this.y * -1,
			r = this.r * -1,
			s = this.s * -1;

		return Transformation.create(x, y, r, s);
	}
}

import createFactory from './ObjectPool';

Transformation.create = createFactory(Transformation);

export default Transformation;
export const create = Transformation.create;
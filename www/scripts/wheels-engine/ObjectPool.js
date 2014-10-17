class ObjectPool {
	constructor(ctor) {
		this.ctor = ctor;
		this.pool = [];
	}

	get(...args) {
		var o = this.pool.pop();

		if (o) {
			this.ctor.apply(o, args);
		} else {
			o = new (this.ctor)(...args);

			var origDispose = o.dispose;
			o.dispose = () => {
				origDispose();
				this.pool.push(o);
			}
		}

		return o;
	}
}

function createPooledFactory(ctor) {
	var pool = new ObjectPool(ctor);
	return pool.get;	
}

export default createPooledFactory;
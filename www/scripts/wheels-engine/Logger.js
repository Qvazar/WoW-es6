var noop = () => {},
	console = window.console;

class Logger {
	constructor() {
		this.cbs = {};

		this.consoleEnabled = false;

		for (level of ['error', 'warn', 'info', 'debug']) {
			this['__' + level] = (o) => {
				if (this.consoleEnabled) {
					console[level](typeof o === 'string' ? o : String.valueOf(o));
				}

				var l = this.cbs[level];
				if (l) {
					for (var cb of l) {
						cb(o);
					}
				}
			};

			var enabledPropName = level + 'Enabled';

			Object.defineProperty(this, enabledPropName, {
				get: () => this[level] !== noop,
				set: (value) => {
					this[level] = value ? this['__' + level] : noop;
				}								
			});
			this[enabledPropName] = level !== 'debug';
		}
	}

	on(level, cb) {
		var l = this.cbs[level];
		if (!l) {
			l = [];
			this.cbs[level] = l;
		}

		l.push(cb);
	}
}

export default Logger;
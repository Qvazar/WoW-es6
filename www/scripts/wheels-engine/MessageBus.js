class MessageBus {
	constructor() {
		this.listeners = {};
		this.getters = {};
	}

	dispose() {
		for (var m in this.listeners) if (this.listeners.hasOwnProperty(m)) {
			delete this.listeners[m];
		}

		for (var m in this.getters) if (this.getters.hasOwnProperty(m)) {
			delete this.getters[m];
		}
	}

	send(msg, ...args) {
		var ls = this.listeners[msg];

		if (ls) {
			for (var l of ls) {
				l(...args);
			}
		}

		ls = this.listeners['*'];

		if (ls) {
			for (var l of ls) {
				args.shift(msg);
				l(...args);
			}
		}
	}

	on(msg, cb) {
		var ls = this.listeners[msg];

		if (!ls) {
			ls = [];
			this.listeners[msg] = ls;
		}

		ls.push(cb);
	}

	off(msg, cb) {
		var ls = this.listeners[msg];

		if (ls) {
			var i = ls.indexOf(cb);
			if (i >= 0) {
				ls.splice(i, 1);
			}
		}
	}

	set(key, cb) {
		this.getters[key] = cb;
	}

	get(key) {
		var getter = this.getters[key];
		return (typeof getter === 'function') ? getter() : null;
	}

	unset(key) {
		if (this.getters.hasOwnProperty(key)) {
			delete this.getters[key];
		}
	}
}

MessageBus.create = createFactory(MessageBus);

import createFactory from './ObjectPool'

export default MessageBus;
export const create = MessageBus.create;


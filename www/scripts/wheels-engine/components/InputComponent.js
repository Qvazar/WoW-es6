import Component from './Component';

function eventToKeyMapping(eventMapping) {
	var keyMapping = {};

	for (var eventName in eventMapping) {
		var eventStr = eventMapping[eventName].toLowerCase(),
			keyStr = eventStr.substring(0, ~((~eventStr.indexOf('+')) || ~eventStr.length)),
			keyCode = eventStr.search(/^\[.*?\]$/) ? parseInt(eventStr.slice(1, -1)) : eventStr.charCodeAt(0),
			keyMap = keyCode + '';
			
		if (~eventStr.indexOf('+alt')) { keyMap += '+alt'; }
		if (~eventStr.indexOf('+ctrl')) { keyMap += '+ctrl'; }
		if (~eventStr.indexOf('+shift')) { keyMap += '+shift'; }

		keyMapping[keyMap] = eventName;
	}

	return keyMapping;
}

function keyMapFromInputEvent(event) {
	var key = event.keyCode,
		keyMap = key + '';

	if (event.altKey) { keyMap += '+alt' };
	if (event.ctrlKey) { keyMap += '+ctrl' };
	if (event.shiftKey) { keyMap += '+shift' };

	return keyMap;	
}

class KeyboardInputComponent extends Component {
	/**
	 * args: {
	 * 	eventMapping: {
	 * 		"w": "forward",
	 * 		"a": "turnleft"
	 * 		"s": "reverse"
	 * 		"d": "turnright"
	 *	},
	 *  inputElement: element to listen for events on
	 * }
	 *
	 */
	constructor(args) {
		if (!args || !args.eventMapping || !args.inputElement) {
			throw { msg: "Missing arguments." };
		}

		super(args);


		this.eventMapping = args.eventMapping;
		this.inputElement = args.inputElement;
		this.keyMapping = eventToKeyMapping(eventMapping);
		this.eventStates = {};

		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
	}

	init(scene, entity) {
		super(scene, entity);

		var e = this.inputElement;
		if (!e) {
			throw {msg: 'Unable to attach key listeners to element - no element found.'};
		}
		e.addEventListener('keydown', this.onKeyDown);
		e.addEventListener('keyup', this.onKeyUp);
		e.addEventListener('mousedown', this.onMouseDown);
		e.addEventListener('mouseup', this.onMouseUp);

		entity.msgbus.set('input', () => this.eventStates);
	}

	dispose() {
		entity.msgbus.unset('input');

		this.eventMapping = null;
		this.keyMapping = null;
		this.eventStates = null;

		super();
	}

	onKeyDown(event) {
		var eventName = this.keyMapping[keyMapFromInputEvent(event)];

		if (eventName) {
			this.eventStates[eventName] = true;
		}
	}

	onKeyUp(event) {
		var eventName = this.keyMapping[keyMapFromInputEvent(event)];

		if (eventName) {
			this.eventStates[eventName] = false;
		}
	}

	onMouseDown(event) {

	}

	onMouseUp(event) {

	}
}

export default KeyboardInputComponent;
export const create = (...args) => new KeyboardInputComponent(...args);
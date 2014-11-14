class DomWrapper {
	constructor(element) {
		this.element = element;
		this.__anchor = {x:0.5, y:0.5};
		this.__width = 0;
		this.__height = 0;

		element.classList.add('dom-renderer-element');
	}

	set(attributes) {
		for (var attr in attributes) if (attributes.hasOwnProperty(attr)) {
			var value = attributes[attr];

			switch (attr) {
				case 'anchor':
					this.__anchor = value;
					break;
				case 'width':
					this.__width = value;
					break;
				case 'height':
					this.__height = value;
					break;
			}

			this.element.setAttribute(attr, value);
		}

		for (var attr of ['anchor', 'width', 'height']) if (attributes.hasOwnProperty(attr)) {
			this.element.style.marginLeft = this.__anchor.x * this.__width * -1;
			this.element.style.marginTop = this.__anchor.y * this.__height * -1;
		}
	}

	get(attribute) {
		return this.element.getAttribute(attribute);
	}
}

export default DomWrapper;
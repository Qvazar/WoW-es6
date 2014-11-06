var animationCounter = 0;
var animationSheet;
var vendorPropertyMap = {};
var vendorPrefixes = ['-moz', '-ms', '-o', '-moz'];

function vendorProperty(property) {
	var vPropName = vendorPropertyMap[property];

	if (vPropName) {
		return vPropName;
	}

	var e = document.createElement('div');

	if (property in e.style) {
		vendorPropertyMap[property] = property;
		return property;
	}

	for (var vp of vendorPrefixes) {
		vPropName = vp + '-' + property;

		if (vPropName in e.style) {
			vendorPropertyMap[property] = vPropName;
			return vPropName;
		}
	}

	return undefined;
}

function getAnimationSheet() {
	if (animationSheet) {
		return animationSheet;
	}

	var e = document.createElement('style').
		head = document.head || document.getElementsByTagName('head')[0];

	e.type = 'text/css';

	head.appendChild(e);

	return (animationSheet = e.sheet);
}

function transformToString(transformation) {
	var t = transformation;
	return `translate3d(${t.x}px, ${t.y}px, 0) rotate3d(0, 0, 1, ${t.r}deg) scale(${t.s})`;
}

export const setTransform = function(element, transformation) {
	element.style.transform = transformToString(transformation);
}

export const animateTransform = function(element, from, to, duration) {
	var animationName = 'animation-' + (animationCounter++),
		stylesheet = getAnimationSheet(),
		vTransformProp = vendorProperty('transform'),
		vAnimationProp = vendorProperty('animation'),
		keyframes = `0% { ${vTransformProp}: ${transformToString(from)}; 100% { ${vTransformProp}: ${transformToString(to)};`;

	if (!vTransformProp || !vAnimationProp) {
		throw {msg: 'CSS Transform or Animation is not implemented on this client.'};
	}

	stylesheet.insertRule(`@keyframes ${animationName} {${keyframes}}`, stylesheet.cssRules.length);

	for (var vp of vendorPrefixes) {
		stylesheet.insertRule(`@${vp}-keyframes ${animationName} {${keyframes}}`, stylesheet.cssRules.length);
	}

	element.style[vAnimationProp] = `${animationName} ${duration}s linear`;
}

export const setProperty = function(element, property, value) {
	if (typeof value === 'number') {
		value += 'px';
	}

	element.style[vendorProperty(property)] = value;
}

export default {
	setTransform,
	animateTransform,
	setProperty
};
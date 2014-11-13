import ObjectPool from '../ObjectPool';
import Component from './Component';
import Transformation from '../Transformation';
import Range from '../Range';
import css from '../css';
import sprites from '../di/sprites';
import physics from '../di/physics';
import screen from '../di/screen';

class Particle {
	constructor(dx, dy) {
		this.x = 0;
		this.y = 0;
		this.dx = dx;
		this.dy = dy;
		this.age = 0;
		this.spriteIndex = 0;
	}
}

Particle.create = ObjectPool(Particle);


class ParticleSystemComponent extends Component {
	/**
	 * settings:
	 *	sprites: array of sprite names
	 *	lifetime: lifetime of particles in seconds
	 *	speed: speed of particles (meters/second)
	 *	fadeout: seconds to fade out before end of lifetime
	 *	transformation: position, direction and scale of particle system
	 *	spread: Range of radians to spread out from direction
	 *  spawnDelay: Range of time between particle spawning
	*/
	constructor(settings) { 
		settings = settings || {};
		settings.sprites = settings.sprites || [];
		settings.lifetime = settings.lifetime || 1;
		settings.speed = settings.speed || 1;
		settings.fadeout = settings.fadeout || 1;
		settings.transformation = settings.transformation || Transformation.create();
		settings.spread = settings.spread || Range.create(0, Math.PI * 2);
		settings.spawnDelay = settings.spawnDelay || Range.create();

		this.settings = settings;

		this.particles = [];
		this.nextSpawnTime = 0;
	}

	init(scene, entity) {
		super(scene, entity);

		this.__element = this.createElement();
		this.__drawCtx = this.__element.getContext('2d');
	}

	dispose() {
		this.removeElement();
	}

	clone() {
		return ParticleSystemComponent.create(this.settings);
	}

	createElement() {
		var e = document.createElement('canvas');
		var settings = this.settings,
			radius = settings.speed * settings.lifetime * physics.pixelsPerMeter;

		e.width = radius * screen.pixelRatio;
		e.height = radius * screen.pixelRatio;
		css.setProperty(e, 'width', radius);
		css.setProperty(e, 'height', radius);
		css.setProperty(e, 'margin-top', radius * -0.5);
		css.setProperty(e, 'margin-left', radius * -0.5);
		css.setTransform(e, settings.transformation);

		this.entity.parent.get('dom:element').appendChild(e);

		return e;
	}

	removeElement() {
		var e = this.__element,
			p;

		if (e && (p = e.parentNode)) {
			p.removeChild(e);
		}
	}

	spawnParticle() {
		var direction = this.settings.spread.random(),
			dx = Math.cos(direction),
			dy = Math.sin(direction);

		this.particles.push(Particle.create(dx, dy));
	}

	update(args) {
		var time = args.gametime;
		if (this.nextSpawnTime <= time) {
			this.spawnParticle();
			nextSpawnTime = time + this.spawnDelay.random();
		}
	}

	render(args) {
		var ctx = this.__drawCtx;
		// TODO draw particle positions between updates
	}
}

ParticleSystemComponent.create = ObjectPool(ParticleSystemComponent);

export default ParticleSystemComponent;
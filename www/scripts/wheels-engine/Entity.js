import {create as msgbusFactory} from './MessageBus';
import {create as transformationFactory} from './Transformation';

class Entity {
  constructor() {
    this.game = null;
    this.parent = null;
    this.components = this.components || {};
    this.entities = this.entities || {};
    this.msgbus = msgbusFactory();
    this.transformation = transformationFactory();
  }

  dispose() {
    for (var c of this.entities) {
      c.dispose();
    }
    this.entities.splice(0, this.entities.length);

    for (var c of this.components) {
      c.dispose();
    }
    this.components.splice(0, this.components.length);

    this.msgbus.dispose();
    this.msgbus = null;
    this.parent = null;
    this.game = null;
  }
  
	update(args) {
    for (var c of this.components) {
      c.update(args);
    }

    for (var c of this.entities) {
      c.update(args);
    }
  }

	render(args) {
		for (var c of this.components) {
			c.render(args);
		}

    for (var c of this.entities) {
      c.render(args);
    }
	}

  addComponents(namedComponents) {
    for (var cn in namedComponents) if (namedComponents.hasOwnProperty(cn)) {
      if (this.components[cn]) {
        throw {msg: 'Entity already has a component named "' + cn + '".'};
      }
      var c = namedComponents[cn];
      this.components[cn] = c;
      c.init(this);
    }
  }

  addEntities(namedEntities) {
    for (var cn in namedEntities) if (namedEntities.hasOwnProperty(cn)) {
      if (this.entities[cn]) {
        throw {msg: 'Entity already has a child entity named "' + cn + '".'};
      }
      var c = namedEntities[cn];
      this.entities[cn] = c;
      c.parent = this;
    }
  }

  removeComponents(...componentNames) {
    for (var cn of componentNames) {
      var c = this.components[cn];

      if (c) {
        c.dispose();
        delete this.components[cn];
      }
    }
  }

  removeEntities(...entityNames) {
    for (var cn of entityNames) {
      var c = this.entities[cn];

      if (c) {
        c.dispose();
        delete this.entities[cn];
      }
    }
  }

  get(key) {
    return this.msgbus.get(key);
  }
}

Entity.create = createFactory(Entity);

import createFactory from './ObjectPool';

export default Entity;
export const create = Entity.create;
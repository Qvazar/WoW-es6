import {create as msgbusFactory} from './MessageBus';
import {create as transformationFactory} from './Transformation';

class Entity {
  constructor() {
    this.parent = null;
    this.components = this.components || {};
    this.entities = this.entities || {};
    this.msgbus = msgbusFactory();
    this.transformation = transformationFactory();
    this.scene = null;

    this.msgbus.on('*', (msg, ...args) => {
      for (var e in this.entities) {
        this.entities[e].msgbus.send(msg, ...args);
      }
    });
  }

  init(scene, parent) {
    this.scene = scene;
    this.parent = parent;
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
    this.scene = null;
  }

  clone() {
    var e = Entity.create(),
        components = {};

    e.transformation = this.transformation;

    for (var cName in this.components) if (this.components.hasOwnProperty(cName)) {
        var component = this.components[cName];
        components[cName] = component.clone();
    }

    e.addComponents(components);
    
    return e;
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
      c.init(this.scene, this);
    }
  }

  addEntities(namedEntities) {
    for (var cn in namedEntities) if (namedEntities.hasOwnProperty(cn)) {
      if (this.entities[cn]) {
        throw {msg: 'Entity already has a child entity named "' + cn + '".'};
      }
      var c = namedEntities[cn];
      this.entities[cn] = c;
      c.init(this.scene, this);
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

  getComponent(cmpName) {
    return this.components[cmpName];
  }

  get(key) {
    return this.msgbus.get(key);
  }
}

import createFactory from './ObjectPool';

Entity.create = createFactory(Entity);

export default Entity;
export const create = Entity.create;
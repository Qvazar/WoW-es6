import Entity from './Entity';
import files from 'di/files';

class EntityFactory {
	constructor(componentsCfg) {
		this.entityPrototypes = {};

		this.registerComponents(componentsCfg);
	}

	loadPrototypes(cfgFile) => {
		return files.getJson(cfgFile).then((cfg) => {

		});
	}

	registerComponents(namedComponents) {
		if (!namedComponents) {
			throw { msg: "!namedComponents" };
		}

		for (cName in namedComponents) if (namedComponents.hasOwnProperty(cName)) {
			var component = namedComponents[cName];

			for (var eTypeName of component.appliesTo) {
				var proto = this.getPrototype(eTypeName);

				if (!proto) {
					proto = Entity.create();
					this.addPrototype(eTypeName, proto);
				}

				proto.addComponents(name, component);
			}
		}
	}

	create(entityTypeName) {
		var e = this.entityPrototypes[entityTypeName];
		return e ? e.clone() : null;
	}

	addPrototype(entityTypeName, entity) {
		this.entityPrototypes[entityTypeName] = entity;
	}

	getPrototype(entityTypeName) {
		return this.entityPrototypes[entityTypeName];
	}
}
import Entity from './Entity';
import files from 'di/files';

class EntityFactory {
	constructor(componentsCfg) {
		this.entityPrototypes = {};
	}

	loadPrototypes(cfgFile) {
		function loadEntity(entityCfg) {
			var e = Entity.create();
			e.addComponents(entityCfg.components);

			var childEntities = {};
			for (var cen in entityCfg.entities) {
				var ce = loadEntity(entityCfg.entities[cen]);
				childEntities[cen] = ce;
			}
			e.addEntities(childEntities);

			return e;
		}

		return files.getJson(cfgFile).then((cfg) => {
			for (var eName in cfg) if (cfg.hasOwnProperty(eName)) {
				var e = loadEntity(cfg[eName]);
				this.addPrototype(eName, e);
			}
		});
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
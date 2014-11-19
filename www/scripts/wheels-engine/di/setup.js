import { setup as setupAudio } from '.di/audio';
import { setup as setupEntityFactory } from './di/entityFactory';
import { setup as setupFiles } from './di/files';
import { setup as setupPhysics } from './physics';
import { setup as setupRenderer } from './renderer';
import { setup as setupLogger } from './logger';
import { setup as setupScreen } from './screen';
import { setup as setupTextures } from './textures';

export default (config) => {
	setupLogger(config.log);
	return setupFiles(...config.filePackages)
		.then(setupAudio(config.soundFiles))
		.then(setupEntityFactory(config.entityFiles))
		.then(setupTextures(config.textureFiles))
		.then(setupScreen())
		.then(setupPhysics())
		.then(setupRenderer());
};
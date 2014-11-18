import { setup as setupAudio } from '.di//audio';
import { setup as setupEntityFactory } from './di/entityFactory';
import { setup as setupFiles } from './di/files';
import { setup as setupTextures } from './textures';

export default (config) => {
	return setupFiles(...config.filePackages)
	.then(() => {
		setupAudio(config.soundFiles).catch(reject);
		setupEntityFactory(config.entityFile);
		setupTextures(config.textureFiles);
	});
};
import { setup as setupAudio } from './audio';
import { setup as setupEntityFactory } from './entityFactory';
import { setup as setupFiles } from './files';
import { setup as setupSprites } from './sprites';

export default (config) => {
	return setupFiles(...config.filePackages)
	.then(() => {
		setupAudio(config.soundFiles).catch(reject);
		setupEntityFactory(config.entityFile);
		setupSprites(config.spriteFiles);
	});
};
import SpriteManager from '../SpriteManager';

var instance = SpriteManager.create();

export default instance;
export const setup = (...images) => instance.load(...images);
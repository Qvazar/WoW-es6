import TextureManager from '../TextureManager';

var instance = TextureManager.create();

export default instance;
export const setup = (...images) => instance.load(...images);
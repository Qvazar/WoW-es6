import SoundManager from '../SoundManager';

var instance = SoundManager.create();

export default instance;
export const setup = (...files) => instance.load(...files);
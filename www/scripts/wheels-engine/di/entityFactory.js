import EntityFactory from '../EntityFactory';

var instance = EntityFactory.create();

export default instance;
export const setup = (cfgFile) => instance.loadPrototypes(cfgFile);
import FileLibrary from '../FileLibrary';

var instance = FileLibrary.create();

export default instance;
export const setup = (...packages) => instance.loadPackages(...packages);
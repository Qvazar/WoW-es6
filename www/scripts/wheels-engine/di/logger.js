import Logger from '../Logger';

var logger = new Logger();

export default logger;
export const setup = (cfg) => {
	for (var l in ['debug', 'info', 'warn', 'error']) {
		logger[l + 'Enabled'] = !!cfg[l];
	}
}
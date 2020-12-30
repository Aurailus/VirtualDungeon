import log4js from 'log4js';
import minimist from 'minimist';
import { promises as fs } from 'fs';

import Server from './Server';
import resolvePath from './ResolvePath';
import { Config, mergeConfig } from './Config';

const DEFAULT_CONF_NAME = 'conf.json';

// Initialize the logger.
const logger = log4js.getLogger();

// Don't allow unhandled Promise rejections.
process.on('unhandledRejection', up => { logger.fatal('Unhandled promise rejection.'); throw up; });

async function start() {
	const args = minimist(process.argv.slice(2)) as any;

	// Find the Configuration file.
	let confPath = resolvePath(args.conf ?? DEFAULT_CONF_NAME);
	
	// Parse the config into conf.
	let conf: Config | null;

	try {
		const file = (await fs.readFile(confPath)).toString();
		conf = mergeConfig(JSON.parse(file), args);
	}
	catch (e) {
		logger.level = 'debug';
		logger.fatal('Failed to parse configuration file \'%s\'.\n %s', confPath, e);
		process.exit(1);
	}

	logger.level = conf.verbose ? 'debug' : conf.logLevel ?? 'info';

	logger.debug('Initializing Virtual Dungeon with configuration file \'%s\'.', confPath);

	// Start the Server.
	try {
		new Server(conf);
	}
	catch (e) {
		logger.fatal('Unhandled Server Exception!\n %s', e);
		process.exit(1);
	}
}

// Initialize AuriServe.
start().then();

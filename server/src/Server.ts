import HTTP from 'http';
import HTTPS from 'https';
import IO from 'socket.io';
import Express from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import path from 'path';
import log4js from 'log4js';
import { promises as fs } from 'fs';

import { Config } from './Config';
import resolvePath from './ResolvePath';

import Database from './Database';
import MapController from './MapController';
import AppRouter from './routers/AppRouter';
import DataRouter from './routers/DataRouter';

const logger = log4js.getLogger();


/**
 * The root server instance, controls the routing and database.
 */

export default class Server {
	private io?: IO.Server;
	private app: Express.Application = Express();

	private db: Database = new Database();

	private siteRouter = new AppRouter(this.db, this.app);
	private dataRouter = new DataRouter(this.db, this.app);

	private mapController = new MapController(this.db);

	constructor(private conf: Config) {
		this.app.use(compression());
		this.app.use(cookieParser());
		this.app.use(bodyParser.json());
		this.app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

		this.app.set('view engine', 'pug');
		this.app.set('views', path.join(path.dirname(__dirname), 'views'));

		this.init().then(async () => {
			await this.siteRouter.init();
			await this.dataRouter.init();

			await this.mapController.init(this.io!);
		});
	}


	/**
	 * Initializes the server and the database.
	 * Throws if there are configuration or database errors.
	 */

	private async init() {
		
		// Initialize HTTP / HTTPS server(s).

		await new Promise<void>(async (resolve) => {
			try {
				if (this.conf.https) {
					if (!this.conf.https.cert || !this.conf.https.key)
						throw 'Config is missing https.cert or https.key fields.';

					let cert: string, key: string;
					try {
						cert = await fs.readFile(resolvePath(this.conf.https.cert), 'utf8');
						key = await fs.readFile(resolvePath(this.conf.https.key), 'utf8');
					}
					catch (e) {
						throw 'Failed to parse HTTPS key / certificate files.\n ' + e;
					}

					const http = HTTP.createServer(this.forwardHttps.bind(this) as any);
					const https = HTTPS.createServer({ cert: cert, key: key }, this.app);

					this.io = (IO as any)(https);

					http.listen(this.conf.port || 80, () => {
						logger.debug('Redirect server listening on port %s.', this.conf.port || 80);
						https.listen(this.conf.https!.port || 443, () => {
							logger.debug('HTTPS Server listening on port %s.', this.conf.https!.port || 443);
							resolve();
						});
					});
				}
				else {
					const http = HTTP.createServer(this.app);

					this.io = (IO as any)(http);

					http.listen(this.conf.port || 80, () => {
						logger.debug('HTTP Server listening on port %s.', this.conf.port || 80);
						resolve();
					});
				}
			}
			catch (e) {
				logger.fatal(e);
				process.exit(1);
			}
		});

		if (!this.conf.db || !this.conf.db.url || !this.conf.db.name) {
			logger.fatal('Config is missing db.url or db.name fields.');
			process.exit(1);
		}

		await this.db.init(this.conf.db.url, this.conf.db.name);

		logger.info('Initialized Virtual Dungeon.');
	}


	/**
	 * Routing function to forward HTTP traffic to HTTPS.
	 *
	 * @param {Express.Request} req - The request object.
	 * @param {Express.Response} res - The response object.
	 */

	private forwardHttps(req: Express.Request, res: Express.Response) {
		const host = req.headers.host;
		if (!host) {
			res.status(403);
			return;
		}

		const loc = 'https://' + host.replace((this.conf.port || 80).toString(), (this.conf.https!.port || 443).toString()) + req.url;
		res.writeHead(301, { Location: loc });
		res.end();
	}
}



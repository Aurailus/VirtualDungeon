import path from "path";
import http from "http";
import IO from "socket.io";
import Express from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import Database, { uploadLimit } from "./Database";
import { Map as DBMap } from "./DBStructs";
import * as Routers from "./routers/Routers";

export default class App {
	private port: number = 3000;

	// private io: IO.Server;
	private app: Express.Application = Express();

	private db: Database = new Database();

	private dataRouter     = new Routers.DataRouter(this.db, this.app);
	private assetRouter    = new Routers.AssetRouter(this.db, this.app);
	private campaignRouter = new Routers.CampaignRouter(this.db, this.app);
	private authRouter     = new Routers.AuthRouter(this.db, this.app);

	constructor() {
		// Set up express features.
		this.app.use(cookieParser());
		this.app.use(bodyParser.json());
		this.app.use(fileUpload({limits: {fileSize: uploadLimit}, useTempFiles: true, tempFileDir: '/tmp/'}));
		this.app.set('view engine', 'pug');

		// Initialize the MongoDB database.
		this.db.init().then(async () => {
			await this.db.createUser("me@auri.xyz", "Auri", "");
			await this.db.createUser("admin@auri.xyz", "ADMINISTRATOR", "");
			await this.db.createCampaign("me@auri.xyz", "campaign");
			await this.db.createMap("me@auri.xyz", "campaign", "map");

			// Configure routes
			this.app.use('/public', Express.static(path.join(__dirname, "/../public")));

			this.dataRouter.init();
			this.assetRouter.init();
			this.campaignRouter.init();
			this.authRouter.init();

			// Start listening for incoming traffic.
			const server = http.createServer(this.app);
			server.listen(this.port, () => console.log(`Listening on ${this.port}.`));

			// Open Socket Listener.
			// this.io = IO(server);
			// io.on('connection', (socket: IO.Socket) => {
			// 	console.log('User connected.')
			// 	socket.on('disconnect', () => console.log('User disconnected.'));
			// });
		});
	}
}

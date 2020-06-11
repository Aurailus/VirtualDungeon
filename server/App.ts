import path from "path";
import http from "http";
import IO from "socket.io";
import Express from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import Database from "./Database";

export default class App {
	private port: number = 3000;

	private io: IO.Server;
	private app: Express.Application;

	private db: Database;

	constructor() {
		this.app = Express();
		this.app.use(cookieParser());
		this.app.use(bodyParser.json());
		this.app.set('view engine', 'pug');

		this.route();

		const server = http.createServer(this.app);
		server.listen(this.port, () => console.log(`Listening on ${this.port}.`));
		this.io = IO(server);

		this.db = new Database();
		this.db.init().then(async () => {
			await this.db.createUser("me@auri.xyz", "Auri", "");
			await this.db.createUser("admin@auri.xyz", "ADMINISTRATOR", "");
		});

		// io.on('connection', (socket: IO.Socket) => {
		// 	console.log('User connected.')

		// 	socket.on('disconnect', () => console.log('User disconnected.'));
		// });
	}

	private route() {
		this.app.use('/public', Express.static(path.join(__dirname, "/../public")));

		this.app.get('/', async (req, res) => {
			let user = await this.db.authUser(req);
			if (user) res.redirect('/campaigns');
			else res.render('login');
		});

		this.app.get('/campaigns/:campaign?/:map?', async (req, res) => {
			let user = await this.db.authUser(req);
			if (!user) { res.redirect('/'); return; }

			let campaign = req.params.campaign;
			let map = req.params.map;

			if (!campaign || typeof campaign != "string")
				res.render('campaigns', { username: (await this.db.getUser(user)).name, campaigns: await this.db.getCampaigns(user) });
			else {
				try {
					let campaignObj = await this.db.getCampaign(user, campaign);
					
					if (!map || typeof map != "string") {
						res.render('campaign', { username: (await this.db.getUser(user)).name, campaign: campaignObj });
					}
					else {
						let mapObj = await this.db.getMap(user, campaign, map);
						res.render('map', { username: (await this.db.getUser(user)).name, campaign: campaignObj, map: mapObj });
					}
				}
				catch (e) {
					res.redirect('/campaigns');
				}
			}
		});

		this.app.get('/builder/:campaign/:map', async (req, res) => {
			let campaign = this.db.sanitizeName(req.params.campaign);
			let map = this.db.sanitizeName(req.params.map);
			if (!campaign || typeof campaign != "string" || !map || typeof map != "string") {
				res.sendStatus(403);
				return;
			}

			let user = await this.db.authUser(req);
			if (user) res.render('builder', { campaign: campaign, map: map });
			else res.redirect('/');
		});

		this.app.post('/campaigns/new', async (req, res) => {
			let user = await this.db.authUser(req);
			if (!user || req.body.name == undefined || typeof req.body.name != "string") {
				res.sendStatus(403);
				return;
			}

			try {
				let safe = await this.db.createCampaign(user, req.body.name);
				res.send(safe);
			}
			catch (e) {
				res.sendStatus(403);
			}
		});

		this.app.post('/maps/new', async (req, res) => {
			let user = await this.db.authUser(req);
			if (!user || req.body.campaign == undefined || typeof req.body.campaign != "string" 
				|| req.body.name == undefined || typeof req.body.name != "string") {
				res.sendStatus(403);
				return;
			}

			try {
				let camp = await this.db.getCampaign(user, req.body.campaign);
				let safe = await this.db.createMap(user, req.body.campaign, req.body.name);
				res.send(safe);
			}
			catch (e) {
				res.sendStatus(403);
			}
		});

		this.app.post('/auth', async (req, res) => {
			if (req.body.email === undefined || typeof req.body.email != "string" 
				|| req.body.pass === undefined || typeof req.body.pass != "string") {
				res.sendStatus(403); return; }
			try {
				let token = await this.db.getAuthToken(req.body.email, req.body.pass);
				res.send(token);
			}
			catch (e) { res.sendStatus(403); }
		});
	}
}

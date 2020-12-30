import Express from "express";

import Router from "./Router"
import Database from "../Database";
import { AppData, AppDataSpecifier } from '../../../common/AppData';


/** Async function that delays returning for the specified delay. */
const delay = (d: number, s?: number) => new Promise(r => setTimeout(r, Math.max(d - (s ? (Date.now() - s) : 0), 0)));


/**
 * Manages data routes that are meant to be queried asynchronously for raw data.
 */

export default class DataRouter extends Router {
	constructor(db: Database, private app: Express.Application) { super(db); }

	init() {
		const getAppData = async (user: string, spec: string): Promise<Partial<AppData>> => {
			const specifiers = spec.split('&') as AppDataSpecifier[];
			let data: Partial<AppData> = {};

			await Promise.all(specifiers.map(async (s) => {
				switch (s) {
					case 'user':
						const userObj = await this.db.getUser(user);
						data.user = { name: userObj.name, user: userObj.user };
						break;

					case 'campaigns':
						data.campaigns = await this.db.getCampaigns(user);
						break;
				}
			}));

			return data;
		};

		/**
		 * Attempts to authenticate a user from a username and password.
		 */
		
		this.router.post('/auth', async (req, res) => {
			const start = Date.now();
			try {
				const user = req.body.user;
				const pass = req.body.pass;

				if (typeof user !== 'string' || typeof pass !== 'string')
					throw 'Request is missing required parameters.';
				
				res.send(await this.db.getAuthToken(user, pass));
			}
			catch (e) {
				await delay(1000, start);
				await delay(Math.random() * 150);
				res.status(403).send('Invalid username or password.');
			}
		});


		/**
		 * Returns an app data partial based on the specifiers provided.
		 */

		this.router.get('/app/:specifier?', this.authRoute(async (user, req, res) => {
			const data = await getAppData(user, req.params.specifier);
			res.send(JSON.stringify(data));
		}));


		/**
		 * Returns the map layout for the specified map.
		 */

		this.router.get('/map/:campaign/:map', this.authRoute(async (user, req, res) => {
			const campaign = this.db.sanitizeName(req.params.campaign);
			const map = this.db.sanitizeName(req.params.map);
			res.send(await this.db.getMap(user, campaign, map));
		}));


		/**
		 * Creates a new campaign.
		 */

		this.router.post('/campaign/new', this.authRoute(async (user, req, res) => {
			if (typeof req.body.title !== 'string' || typeof req.body.description !== 'string') throw 'Invalid parameters.';
			await this.db.createCampaign(user, req.body.title, req.body.description);
			res.send(await getAppData(user, 'campaigns'));
		}));


		/**
		 * Creates a new campaign.
		 */
		 
	 	this.router.post('/map/new', this.authRoute(async (user, req, res) => {
			if (typeof req.body.campaign !== 'string' || typeof req.body.name !== 'string') throw 'Invalid parameters.';
			await this.db.createMap(user, req.body.campaign, req.body.name);
			res.send(await getAppData(user, 'campaigns'));
		}));


		/**
		 * Returns the assets required for a campaign.
		 */

		this.router.get('/assets/:campaign/', this.authRoute(async (user, req, res) => {
			const campaign = this.db.sanitizeName(req.params.campaign);
			res.send(await this.db.getCampaignAssets(user, campaign));
		}));


		this.app.use('/data', this.router);
	}
}

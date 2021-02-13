import Express from 'express';

import Router from './Router'
import Database from '../Database';
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

					case 'assets':
						data.assets = await this.db.getUserAssets(user);
						break;

					case 'collections':
						data.collections = await this.db.getUserCollections(user);
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
		 * Gets campaign info for a campaign token.
		 */
 
		this.router.get('/campaign/invite/:token', this.authRoute(async (_, req, res) => {
			if (typeof req.params.token !== 'string') throw 'Invalid parameters.';
			res.send(await this.db.getCampaignFromInvite(req.params.token));
		}));


		/**
		 * Creates a new map within a campaign.
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
			const assets = await this.db.getCampaignAssets(user, campaign);
			res.send(assets);
		}));


		/**
		 * Uploads an asset to the asset database.
		 */

		this.router.post('/asset/upload/', this.authRoute(async (user, req, res) => {
			const data = JSON.parse(req.body.data);
			const type: 'floor' | 'token' | 'detail' | 'wall' = data.type;

			if (typeof data.name !== 'string' || typeof data.identifier !== 'string' ||
				(type !== 'token' && type !== 'floor' && type !== 'wall' && type !== 'detail') ||
				(type === 'token' && data.tokenType !== 1 && data.tokenType !== 4 && data.tokenType !== 8))
				return res.sendStatus(400);

			const file = req.files?.file;
			if (!file || Array.isArray(file)) return res.sendStatus(400);

			const status = await this.db.uploadAsset(user, type, file, data);
			if (status !== 200) res.sendStatus(status);
			else res.send(await getAppData(user, 'assets'));

			return 0;
		}));


		/**
		 * Deletes an asset from the database & filesystem.
		 */

		this.router.post('/asset/delete/', this.authRoute(async (user, req, res) => {
			const identifier = req.body.identifier;

			if (typeof identifier !== 'string') res.sendStatus(400);
			else {
				await this.db.deleteAsset(user, identifier);
				res.sendStatus(200);
			}
		}));


		/**
		 * Adds an asset to a collection.
		 */
		 
	 	this.router.post('/collection/add', this.authRoute(async (user, req, res) => {
			if (typeof req.body.collection !== 'string' || typeof req.body.asset !== 'string') throw 'Invalid parameters.';

			await this.db.addCollectionAsset(user, req.body.collection, req.body.asset);
			res.send(await getAppData(user, 'collections'));
		}));


		/**
		 * Enables or disabled the invite link for a campaign.
		 */
		 
	 	this.router.post('/invite/refresh', this.authRoute(async (user, req, res) => {
			if (typeof req.body.campaign !== 'string' || typeof req.body.enabled !== 'boolean') throw 'Invalid parameters.';

			await this.db.toggleInvite(user, req.body.campaign, req.body.enabled);
			res.send(await this.db.getInvite(user, req.body.campaign));
		}));


		/**
		 * Gets the current invite link for a campaign, returns empty string if there is none.
		 */

	 	this.router.post('/invite/get', this.authRoute(async (user, req, res) => {
			if (typeof req.body.campaign !== 'string') throw 'Invalid parameters.';
			res.send(await this.db.getInvite(user, req.body.campaign));
	 	}));


		/**
		 * Gets the current invite link for a campaign, returns empty string if there is none.
		 */

	 	this.router.post('/invite/accept', this.authRoute(async (user, req, res) => {
			if (typeof req.body.token !== 'string') throw 'Invalid parameters.';
			await this.db.acceptInvite(user, req.body.token);
			res.send(await getAppData(user, 'campaigns'));
	 	}));


		this.app.use('/data', this.router);
	}
}

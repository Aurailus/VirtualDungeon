import Express from "express";

import Router from "./Router"
import Database from "../Database";

export default class CampaignRouter extends Router {
	constructor(db: Database, app: Express.Application) {
		super(db, app);
	}

	init() {

		// Listing Pages

		this.app.get('/', async (req, res, next) => {
			try {
				let user = await this.db.authUser(req);
				res.redirect('/campaigns');
			}
			catch (e) {
				next();
			}
		});

		this.app.get('/campaigns/:campaign?/:map?', async (req, res) => {
			try {
				let user = await this.db.authUser(req);
				let userObj = await this.db.getUser(user);

				let campaign = req.params.campaign;
				let map = req.params.map;

				if (typeof campaign != "string") {
					res.render('campaigns', { username: userObj.name, campaigns: await this.db.getCampaigns(user) });
				}
				else if (typeof map != "string") {
					let campaignObj = await this.db.getCampaign(user, campaign);
					res.render('campaign', { username: userObj.name, campaign: campaignObj });
				}
				else {
					let campaignObj = await this.db.getCampaign(user, campaign);
					let mapObj = await this.db.getMap(user, campaign, map);
					res.render('map', { username: userObj.name, campaign: campaignObj, map: mapObj });
				}
			}
			catch (e) {
				res.redirect('/');
			}
		});

		// Post Requests

		this.app.post('/campaigns/new', async (req, res) => {
			try {
				const campaign = req.body.name;
				if (typeof campaign != "string") throw "Request is missing required parameters.";
				const user = await this.db.authUser(req);

				let identifier = await this.db.createCampaign(user, campaign);
				res.send(identifier);
			}
			catch (e) { 
				this.routeError(res, 403, e);
			}
		});

		this.app.post('/maps/new', async (req, res) => {
			try {
				const campaign = req.body.campaign;
				const map = req.body.name;

				if (typeof campaign != "string" || typeof map != "string") throw "Request is missing required parameters.";

				let user = await this.db.authUser(req);
				let camp = await this.db.getCampaign(user, campaign);
				let identifier = await this.db.createMap(user, campaign, map);
				res.send(identifier);
			}
			catch (e) {
				this.routeError(res, 403, e);
			}
		});
	}
}

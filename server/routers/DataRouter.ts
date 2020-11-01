import Express from "express";

import Router from "./Router"
import Database from "../Database";

export default class DataRouter extends Router {
	constructor(db: Database, app: Express.Application) {
		super(db, app);
	}

	init() {
		this.app.get('/data/:campaign/:map', async (req, res) => {
			try {
				const campaign = this.db.sanitizeName(req.params.campaign);
				const map = this.db.sanitizeName(req.params.map);
				const user = await this.db.authUser(req);

				res.send(await this.db.getMap(user, campaign, map));
			}
			catch (e) { 
				res.sendStatus(403) 
			};
		});

		this.app.get('/editor/:campaign/:map', async (req, res) => {
			try {
				const campaign = this.db.sanitizeName(req.params.campaign);
				const map = this.db.sanitizeName(req.params.map);
				const user = await this.db.authUser(req);

				res.render('editor', { campaign: campaign, map: map });
			}
			catch (e) { 
				res.redirect('/'); 
			}
		});
	}
}

import path from 'path';
import Express from "express";

import Router from "./Router";
import Database from "../Database";


/**
 * Manages server-side App routing.
 */

export default class AppRouter extends Router {
	constructor(db: Database, private app: Express.Application) { super(db); }

	init() {
		this.router.use('/script', Express.static(path.join(path.dirname(__dirname), '../../app/build')));
		this.router.use('/static', Express.static(path.join(path.dirname(__dirname), '../../app/res')));
		this.router.use('/asset', Express.static(path.join(path.dirname(__dirname), '../../assets')));

		this.router.get('(/*)?', async (_, res) => res.render(path.join(path.dirname(__dirname), '..', 'views', 'app')));

		this.app.use('/app', this.router);

		// this.app.get('/assets/:user/:content/:type/:specifier', (req, res) => {
		// 	try {
		// 		let user = this.db.sanitizeName(req.params.user);
		// 		let content = this.db.sanitizeName(req.params.content);
		// 		let type = this.db.sanitizeName(req.params.type);
		// 		let specifier = req.params.specifier == "*" ? "*" : this.db.sanitizeName(req.params.specifier);

		// 		if (typeof user != "string" || typeof content != "string"
		// 			|| typeof type != "string" || typeof specifier != "string")
		// 				throw "Request is missing required parameters.";

		// 		this.db.getAssetPaths

		// 	}
		// 	catch (e) {
		// 		res.sendStatus(403);
		// 	}
		// });

		// this.app.post('/assets/upload/:type', async (req, res) => {
		// 	try {
		// 		const name: string = req.body.name;
		// 		const identifier: string = req.body.identifier;
		// 		if (typeof name != "string" || typeof identifier != "string") throw "Request is missing required parameters.";

		// 		if (!req.files || !req.files.file) throw "No files were specified.";
		// 		if (Array.isArray(req.files.file)) throw "Multiplie files were sent in one request.";
		// 		const file: UploadedFile = req.files.file;

		// 		let type: AssetType;
		// 		if      (req.params.type == "wall") type = AssetType.WALL;
		// 		else if (req.params.type == "token") type = AssetType.TOKEN;
		// 		else if (req.params.type == "ground") type = AssetType.GROUND;
		// 		else if (req.params.type == "overlay") type = AssetType.OVERLAY;
		// 		else throw "Invalid asset type specified.";

		// 		const user = await this.db.authUser(req);

		// 		res.send((await this.db.acceptAsset(user, type, file, name, identifier)).toString());
		// 	}
		// 	catch (e) {
		// 		this.routeError(res, 403, e);
		// 	}
		// })
	}
}

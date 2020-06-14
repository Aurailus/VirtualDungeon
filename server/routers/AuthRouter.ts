import Express from "express";

import Router from "./Router"
import Database from "../Database";

export default class AuthRouter extends Router {
	constructor(db: Database, app: Express.Application) {
		super(db, app);
	}

	init() {
		this.app.get('/', async (req, res) => res.render('auth/login'));
		// this.app.get('/', async (req, res) => res.render('home'));

		this.app.post('/auth', async (req, res) => {
			try {
				const email = req.body.email;
				const pass = req.body.pass;

				if (typeof email != "string" || typeof pass != "string")
					throw "Request is missing required parameters.";
				
				res.send(await this.db.getAuthToken(email, pass));
			}
			catch (e) {
				this.routeError(res, 403, e);
			}
		});

		this.app.get('/register', async (req, res) => res.render('auth/register'));

		this.app.post('/register', async (req, res) => {
			console.log("THIS IS HAPPENING");
			try {
				const email: string = req.body.email;
				const name: string = req.body.name;
				const pass: string = req.body.pass;

				if (typeof email != "string" || typeof name != "string" || typeof pass != "string")
					throw "Request is missing required parameters.";

				if (!/^\w+@\w+\.[\w.]{0,9}\w$/g.test(email)) 
					throw "The inputted email is invalid.";
				if (!/^\w{3,32}$/g.test(name)) 
					throw "Username must be 3-32 characters long, and only contain alphanumeric characters.";
				if (!/.{8,}/g.test(pass) || !/\d+/g.test(pass) || !/[^\w ]+/g.test(pass)) 
					throw "Password must be at least 8 characters long, and contain a letter and a symbol."

				await this.db.createUser(email, name, pass);
				res.send(await this.db.getAuthToken(email, pass));
			}
			catch (e) {
				this.routeError(res, 403, e);
			}
		});
	}
}

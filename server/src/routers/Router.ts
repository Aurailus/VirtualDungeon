import Express from 'express';

import Database from '../Database';

export default class Router {
	router: Express.Router = Express.Router();

	constructor(protected db: Database) {}

	protected authRoute(fn: (user: string, req: Express.Request, res: Express.Response, next: Express.NextFunction) => any, code?: number) {
		return async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
			try {
				const user = await this.db.authUser(req);
				await this.safeRoute(async (...p) => await fn(user, ...p), code)(req, res, next);
			}
			catch (e) {
				this.routeError(res, e, code);
			}
		};
	}

	protected safeRoute(fn: (req: Express.Request, res: Express.Response, next: Express.NextFunction) => any, code?: number) {
		return async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
			try {
				await fn(req, res, next);
			}
			catch (e) {
				this.routeError(res, e, code);
			}
		};
	}

	protected routeError(res: Express.Response, e: any, code?: number) {
		if (typeof e == 'string') {
			res.status(code ?? 403).send(e);
		}
		else {
			res.sendStatus(code ?? 403);
			console.log(e);
		}
	}
}

import fs from 'fs';
import path from 'path';
import log4js from 'log4js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { MongoClient, Db } from 'mongodb';
import { UploadedFile } from 'express-fileupload';

import * as DB from '../../common/DBStructs'

const logger = log4js.getLogger();

const PERSONAL_ASSETS = "_";

export const uploadLimit = 2 * 1024 * 1024;
export const accountLimit = 5 * 1024 * 1024;

export enum FileStatus { ACCEPTED, FAILED, TYPE_INVALID, FILE_LIMIT, ACCT_LIMIT, NAME_USED }

export default class Database {
	client: MongoClient | null = null;
	db: Db | null = null;

	async init(url: string, db: string) {
		this.client = new MongoClient(url, { useUnifiedTopology: true });

		try {
			await this.client.connect();
			logger.debug('Connected to MongoDB successfully.');

			this.db = this.client.db(db);

			// Temp: Delete all users.
			await this.db.collection('users').deleteMany({});
			await this.db.collection('assets').deleteMany({});
			// await this.db.collection('tokens').deleteMany({});
			await this.db.collection('campaigns').deleteMany({});
			await this.db.collection('assets').deleteMany({});

			await this.createUser('me@auri.xyz', 'Auri', 'password');

			await this.db.collection('assets').insertOne({
				user: "me@auri.xyz",
				identifier: "16x_fantasy",
				name: "Fantasy (16x)",

				contents: [{
					type: DB.AssetType.GROUND,
					identifier: "floor_rock",
					name: "Rocky Ground",

					path: "/app/asset/16x_fantasy_floor_rock.png",
					size: 0,
					
					tileSize: {x: 16, y: 16}
				}, {
					type: DB.AssetType.WALL,
					identifier: "wall_dungeon",
					name: "Dungeon Bricks",

					path: "/app/asset/16x_fantasy_wall_dungeon.png",
					size: 0,
					
					tileSize: {x: 16, y: 16}
				}, {
					type: DB.AssetType.TOKEN,
					identifier: "cadin_1",
					name: "Cadin 1",

					path: "/app/asset/16x_fantasy_cadin_1.png",
					size: 0,
					
					tileSize: {x: 18, y: 18},
					spriteSize: {x: 1, y: 1}
				}]
			});
		}
		catch (e) {
			logger.fatal('Failed to connect to MongoDB instance %s with database %s.\n %s', url, db, e);
			process.exit(1);
		}
	}


	/**
	 * Create a user in the database from a user string, a name, and a password.
	 * Throws if another user with the same user string already exists.
	 *
	 * @param {string} user - The user identifier in the form of an email.
	 * @param {string} name - A username that the user will be referred to as.
	 * @param {string} password - A password for the user account.
	 */

	async createUser(user: string, name: string, password: string) {
		const collection = this.db!.collection('users');
		if (await collection.findOne({user: user}) != null) throw "A user with this email address already exists.";

		let pass = await bcrypt.hash(password, 10);
		await collection.insertOne({ name: name, user: user, pass: pass, assetSpace: 0 });
	}


	/**
	 * Get a User database object from a user identifier.
	 * Throws if the user doesn't exist.
	 *
	 * @param {string} user - The user identifier.
	 */

	async getUser(user: string): Promise<DB.User> {
		const users = this.db!.collection('users');
		const userObj: DB.User | null = await users.findOne({user: user});
		if (!userObj) throw "This user no longer exists.";

		return userObj;
	}


	/**
	 * Get a list of a user's campaigns.
	 *
	 * @param {string} user - The user identifier.
	 */

	async getCampaigns(user: string): Promise<DB.Campaign[]> {
		return (await this.db!.collection('campaigns').find({user: user}).toArray())
			.sort((a: DB.Campaign, b: DB.Campaign) => a.title.charCodeAt(0) < b.title.charCodeAt(0) ? -1 : 1);
	}


	/**
	 * Create a campaign and return the identifier.
	 * Throws if the campaign identifier is empty,
	 * or a campaign already exists with the same identifier.
	 *
	 * @param {string} user - The user identifier.
	 * @param {string} name - The campaign name.
	 */

	async createCampaign(user: string, title: string, description?: string): Promise<string> {
		if (title.length < 3 || title.length > 64) throw "Campaign name must be 3-64 characters long.";

		let identifier = this.sanitizeName(title);
		if (identifier.length < 3) "Campaign name must contain at least 3 alphanumeric characters.";
		const collection = this.db!.collection('campaigns');
		const exists = await collection.findOne({user: user, identifier: identifier});
		if (exists) throw "A campaign of this name already exists.";

		
		let campaign: DB.Campaign = {
			user: user,
			identifier: identifier,

			title: title,
			description: description ?? '',
			
			maps: [],
			assets: [
				{user: "me@auri.xyz", group: PERSONAL_ASSETS},
				{user: "me@auri.xyz", group: "16x_fantasy"}
			]
		}

		await collection.insertOne(campaign)
		return identifier;
	}
	

	/**
	 * Get a campaign.
	 * Throws if the campaign doesn't exist.
	 *
	 * @param {string} user - The user identifier.
	 * @param {string} identifier - The campaign identifier.
	 */

	async getCampaign(user: string, identifier: string): Promise<DB.Campaign> {
		const collection = this.db!.collection('campaigns');
		let camp = await collection.findOne({user: user, identifier: identifier});
		if (!camp) throw "This campaign no longer exists.";
		return camp;
	}


	/**
	 * Create a map and return the identifier.
	 * Throws if the campaign identifier or the map identifier is empty,
	 * the campaign doesn't exist, or a map already exists with the same identifier.
	 *
	 * @param {string} user - The user identifier.
	 * @param {string} campaign - The campaign name.
	 * @param {string} map - The map name.
	 */

	async createMap(user: string, campaign: string, map: string) {
		if (campaign.length > 64) throw "Invalid campaign specified.";
		if (map.length < 3 || map.length > 64) throw "Map name must be 3-64 characters long.";

		let mapIdentifier = this.sanitizeName(map);
		if (mapIdentifier.length < 3) "Map name must contain at least 3 alphanumeric characters.";

		let campIdentifier = this.sanitizeName(campaign);

		const collection = this.db!.collection('campaigns');
		
		let exists = await collection.findOne({user: user, identifier: campIdentifier});
		if (!exists) throw "This campaign no longer exists.";
		let mapExists = await collection.findOne({
			user: user,
			identifier: campIdentifier,
			maps: { $elemMatch: {
					identifier: mapIdentifier
			}}
		});
		if (mapExists) throw "A map of this name already exists.";

		await collection.updateOne({user: user, identifier: campIdentifier}, {
			$push: {maps: {name: map, identifier: mapIdentifier, size: {x: 100, y: 100}, tiles: ""}}});
		return mapIdentifier;
	}


	/**
	 * Get a map.
	 * Throws if the map or the campaign doesn't exist.
	 *
	 * @param {string} user - The user identifier.
	 * @param {string} campaign - The campaign identifier.
	 * @param {string} map - The map identifier.
	 */

	async getMap(user: string, campaign: string, map: string) {
		const collection = this.db!.collection('campaigns');
		let exists = await collection.findOne({user: user, identifier: campaign, maps: { $elemMatch: {identifier: map}}});
		if (!exists) throw "This map no longer exists.";
		let mapObj = null;
		for (let i of exists.maps) {
			if (i.identifier == map) { mapObj = i; break; }
		}
		return mapObj;
	}


	/**
	 * Get a campaign's asset keys & urls.
	 * Throws if the campaign doesn't exist.
	 *
	 * @param {string} user - The user identifier.
	 * @param {string} identifier - The campaign identifier.
	 */

	async getCampaignAssets(user: string, identifier: string): Promise<DB.Asset[]> {
		const camp = await this.db!.collection('campaigns').findOne({user: user, identifier: identifier});
		if (!camp) throw "This campaign no longer exists.";

		let vals: DB.Asset[] = [];

		await Promise.all(camp.assets.map(async (v: DB.AssetListing) => {
			let campaign = await this.db!.collection('assets').findOne({user: v.user, identifier: v.group});
			if (campaign) campaign.contents.forEach((e: DB.Asset) => {
				if (!v.identifier || v.identifier === e.identifier) vals.push(e);
			});
		}))

		return vals;
	}


	/**
	 * Accepts an asset that was uploaded by users, and links it to the DB.
	 * Returns a status code for the file.
	 *
	 * @param {string} user - The user identifier.
	 * @param {DB.AssetType} type - The type of the asset.
	 * @param {UploadedFile} file - The file to accept.
	 * @param {string} name - The name of the asset.
	 * @param {string} identifier - The identifier of the asset.
	 */

	async acceptAsset(user: string, type: DB.AssetType, file: UploadedFile, name: string, identifier: string): Promise<FileStatus> {
		try {

			// Validate that the file is able to be used as an asset.

			if (file.mimetype != "image/png" && file.mimetype != "image/jpeg")
				return FileStatus.TYPE_INVALID;

			if (file.size > uploadLimit || file.truncated)
				return FileStatus.FILE_LIMIT;

			if (identifier.length > 32 || name.length > 32 || this.sanitizeName(identifier) != identifier)
				return FileStatus.FAILED;

			// Check that there's space in the user's account and modify the assetSpace.

			const ret = await this.db!.collection('users').findOneAndUpdate(
				{user: user, assetSpace: {$lte: accountLimit - file.size }}, { $inc: { assetSpace: file.size }});
			
			if (ret.value == null)
				return FileStatus.ACCT_LIMIT;

			// Move the file to the public assets directory.

			let exportName: string;
			let exportExt = file.mimetype == "image/png" ? ".png" : ".jpg";

			do exportName = crypto.createHash('md5').update(identifier + await crypto.randomBytes(8)).digest("hex");
			while (fs.existsSync(path.join(__dirname, "/../public/assets/" + exportName + exportExt)));

			await file.mv(path.join(__dirname, "/../public/assets/" + exportName + exportExt));

			// Update the database.

			await this.db!.collection('assets').findOneAndUpdate({user: user, identifier: PERSONAL_ASSETS}, {
				$set: {
					user: user,
					identifier: PERSONAL_ASSETS,
					name: "Personal Assets"
				},

				$push: { contents: {
					type: type,
					name: name,
					identifier: identifier,
					path: `/public/assets/${exportName}${exportExt}`,
					size: file.size,
					tileSize: { x: 18, y: 18 },
					spriteSize: { x: 1, y: 1 }
				}}
			}, {upsert: true});

			return FileStatus.ACCEPTED;
		}
		catch(e) {
			console.log(e);
			return FileStatus.FAILED;
		}
	}


	/**
	 * Creates and returns an authentication token for a user using a username / password pair.
	 * Throws if the username and password do not refer to a valid user.
	 *
	 * @param {string} user - The user identifier.
	 * @param {string} password - An unhashed password.
	 */

	async getAuthToken(user: string, password: string): Promise<string> {
		const users = this.db!.collection('users');
		const userObj: DB.User | null = await users.findOne({user: user.toLowerCase()});

		if (!userObj || !await bcrypt.compare(password, userObj.pass)) throw "Incorrect email or password.";

		const buffer = await crypto.randomBytes(48);
		const token = buffer.toString('hex');

		const tokens = this.db!.collection('tokens');
		const tkn = {user: user, token: token, expires: (Date.now() / 1000) + 60 * 60 * 24 * 3};
		await tokens.insertOne(tkn);

		return token;
	}


	/**
	 * Returns the user identifier that a token points to when provided with a
	 * token string or a network request containing a 'tkn' cookie.
	 * Throws if the token doesn't exist.
	 *
	 * @param {string | request} token - The token to authenticate.
	 */

	async authUser(token: string | any): Promise<string> {
		if (typeof token !== "string") {
			if (!token.cookies || !token.cookies.tkn || typeof token.cookies.tkn != "string")
				throw "Auth token is no longer valid, please reload the page.";
			token = token.cookies.tkn;
		}
		await this.pruneTokens();
		let inst: DB.AuthToken | null = await this.db!.collection('tokens').findOne({token: token});
		if (!inst) throw "Auth token is no longer valid, please reload the page.";
		return inst.user;
	}


	/**
	 * Prune authentication tokens that are past their expiry date.
	 */

	private async pruneTokens() {
		const tokens = this.db!.collection('tokens');
		await tokens.deleteMany({expires: {$lt: (Date.now() / 1000)}});
	}


	/**
	 * Sanitize a name for use as an identifier, and return that value.
	 * Throws if the passed in value isn't a string, or identifier generated is empty.
	 *
	 * @param {string} name - The name to be sanitized.
	 */

	sanitizeName(name: string) {
		if (typeof name != "string" || name.length < 1) throw "Name must not be empty.";
		const sanitized = name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
		if (sanitized.length == 0) throw "Name must include at least one alphanumeric character.";
		return sanitized;
	}
}

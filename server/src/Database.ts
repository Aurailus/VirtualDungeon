import path from 'path';
import log4js from 'log4js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import sizeOfRaw from 'image-size';
import { MongoClient, Db } from 'mongodb';
import { UploadedFile } from 'express-fileupload';
import { promises as fs, constants as fsc } from 'fs';

import * as DB from '../../common/DBStructs'

const sizeOf = promisify(sizeOfRaw);
const logger = log4js.getLogger();

const PERSONAL_IDENTIFIER = '_';
const ASSET_PATH = path.join(path.dirname(path.dirname(__dirname)), 'assets');

export const uploadLimit = 2 * 1024 * 1024;
export const accountLimit = 5 * 1024 * 1024;

interface BaseAssetData {
	name: string;
	identifier: string;
	file: UploadedFile;
}

interface TilesetData {
	type: 'floor' | 'wall' | 'detail'
}

interface TokenData {
	type: 'token',
	tokenType: 1 | 4 | 8
}

export type UploadError = 'req_invalid' | 'server_error';
export type AssetData = BaseAssetData & (TilesetData | TokenData);

async function getIdentifier(base: string, len: number = 32) {
	return crypto.createHash('md5').update(base + await crypto.randomBytes(8)).digest('hex').substr(0, len);
}

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
			// await this.db.collection('invites').deleteMany({});
			// await this.db.collection('tokens').deleteMany({});
			// await this.db.collection('campaigns').deleteMany({});
			// await this.db.collection('assets').deleteMany({});
			// await this.db.collection('collections').deleteMany({});

			await this.createUser('me@auri.xyz', 'Auri', 'password');
			await this.createUser('zythia.woof@gmail.com', 'Zythia', 'password');

			// await this.db.collection('assets').insertMany([{
			// 	type: 'ground',

			// 	user: 'me@auri.xyz',
			// 	identifier: 'fantasy_floor_rock',
			// 	name: 'Rocky Ground',

			// 	path: 'auri_16x_fantasy_floor_rock.png',
			// 	size: 0,
				
			// 	tileSize: 16
			// }, {
			// 	type: 'wall',

			// 	user: 'me@auri.xyz',
			// 	identifier: 'fantasy_wall_dungeon',
			// 	name: 'Dungeon Bricks',

			// 	path: 'auri_16x_fantasy_wall_dungeon.png',
			// 	size: 0,
				
			// 	tileSize: 16
			// }, {
			// 	type: 'token',

			// 	user: 'me@auri.xyz',
			// 	identifier: 'fantasy_cadin_1',
			// 	name: 'Cadin 1',

			// 	path: 'auri_16x_fantasy_cadin_1.png',
			// 	fileSize: 0,
				
			// 	dimensions: {x: 18, y: 18},
			// 	tileSize: 18
			// }] as DB.Asset[]);

			// await this.db.collection('collections').insertMany([{
			// 	user: 'me@auri.xyz',
			// 	identifier: '16x_fantasy',
			// 	name: 'Fantasy (16x)',
			// }, {
			// 	user: 'me@auri.xyz',
			// 	identifier: PERSONAL_IDENTIFIER,
			// 	name: 'Personal Assets',
			// }] as DB.AssetCollection[]);
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
		if (await collection.findOne({user: user}) != null) throw 'A user with this email address already exists.';

		let pass = await bcrypt.hash(password, 10);
		await collection.insertOne({ name: name, user: user, pass: pass, assetSize: 0 });
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
		if (!userObj) throw 'This user no longer exists.';

		return userObj;
	}


	/**
	 * Get a list of campaigns that the user owns, or has joined.
	 *
	 * @param {string} user - The user identifier.
	 */

	async getCampaigns(user: string): Promise<DB.UserCampaign[]> {
		return (await this.db!.collection('campaigns').find({ $or: [{ user: user }, { players: { $all: [ user ]}}]}).toArray())
			.map((c: Partial<DB.Campaign>): DB.UserCampaign => {
				if (c.user !== user) delete c.maps;
				delete c.assets;
				return c as any;
			})
			.sort((a, b) => a.title.charCodeAt(0) < b.title.charCodeAt(0) ? -1 : 1);
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
		if (title.length < 3 || title.length > 64) throw 'Campaign name must be 3-64 characters long.';

		let identifier = this.sanitizeName(title);
		if (identifier.length < 3) 'Campaign name must contain at least 3 alphanumeric characters.';
		const collection = this.db!.collection('campaigns');
		const exists = await collection.findOne({user: user, identifier: identifier});
		if (exists) throw 'A campaign of this name already exists.';

		let campaign: DB.Campaign = {
			user: user,
			identifier: identifier,

			title: title,
			description: description ?? '',
			
			maps: [],
			players: [],
			assets: [ '#' + user + ':' + PERSONAL_IDENTIFIER ]
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
		let camp = await this.db!.collection('campaigns').findOne({user: user, identifier: identifier});
		if (!camp) throw 'This campaign no longer exists.';
		return camp;
	}


	/**
	 * Get a campaign from a valid invite token.
	 * Throws if the invite has expired or the campaign doesn't exist.
	 *
	 * @param {string} token - An invite token generated using toggleInvite().
	 */

	async getCampaignFromInvite(token: string): Promise<Partial<DB.Campaign>> {
		const info = await this.db!.collection('invites').findOne({ token });
		if (!info) throw 'Token is no longer valid.';
		const camp = await this.db!.collection('campaigns').findOne({ user: info.user, identifier: info.identifier });
		if (!camp) throw 'Campaign no longer exists.';
			
		delete camp._id;
		delete camp.maps;
		delete camp.assets;

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
		if (campaign.length > 64) throw 'Invalid campaign specified.';
		if (map.length < 3 || map.length > 64) throw 'Map name must be 3-64 characters long.';

		let mapIdentifier = this.sanitizeName(map);
		if (mapIdentifier.length < 3) 'Map name must contain at least 3 alphanumeric characters.';

		let campIdentifier = this.sanitizeName(campaign);

		const collection = this.db!.collection('campaigns');
		
		let exists = await collection.findOne({user: user, identifier: campIdentifier});
		if (!exists) throw 'This campaign no longer exists.';
		let mapExists = await collection.findOne({
			user: user,
			identifier: campIdentifier,
			maps: {
				$elemMatch: {
					identifier: mapIdentifier
				}
			}
		});
		if (mapExists) throw 'A map of this name already exists.';

		await collection.updateOne({user: user, identifier: campIdentifier}, {
			$push: { maps: { name: map, identifier: mapIdentifier, size: { x: 64, y: 64 }, layers: '' }}});
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
		if (!exists) throw 'This map no longer exists.';
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
		const camp: DB.Campaign | null = await this.db!.collection('campaigns').findOne({user: user, identifier: identifier});
		if (!camp) throw 'This campaign no longer exists.';

		const collections = camp.assets.filter(a => a.startsWith('#'));
		let assetIdentifiers = camp.assets.filter(a => !a.startsWith('#'));

		await Promise.all(collections.map(async (colString) => {
			const user = colString.substring(1, colString.indexOf(':'));
			const iden = colString.substring(colString.indexOf(':') + 1);
			assetIdentifiers.push(...(await this.db!.collection('collections').findOne({ user: user, identifier: iden }))?.items || []);
		}));

		return await Promise.all(assetIdentifiers.map(async (idenString) => {
			const user = idenString.substring(0, idenString.indexOf(':'));
			const identifier = idenString.substring(idenString.indexOf(':') + 1);
			return await this.db!.collection('assets').findOne({ user, identifier });
		}));
	}


	/**
	 * Gets a users's uploaded assets.
	 */

	async getUserAssets(user: string): Promise<DB.Asset[]> {
		return await this.db!.collection('assets').find({ user }).toArray();
	}


	/**
	 * Gets a user's collections.
	 */


	async getUserCollections(user: string): Promise<DB.AssetCollection[]> {
		return await this.db!.collection('collections').find({ user }).toArray();
	}


	/**
	 * Adds an asset to a user's collection
	 *
	 * @param user - The user that owns the collection.
	 * @param collection - The collection to insert an item into.
	 * @param asset - An Asset string to add to the collection.
	 */


	async addCollectionAsset(user: string, collection: string, asset: string) {
		const res = await this.db!.collection('assets').find({
			user: asset.slice(0, asset.indexOf(':')),
			identifier: asset.slice(asset.indexOf(':') + 1)
		});
		if (!res) throw 'Asset doesn\'t exist.';

		const matched = await this.db!.collection('collections')
			.updateOne({ user: user, identifier: collection }, { $addToSet: { items: asset }});
		if (!matched.matchedCount) throw 'Collection doesn\'t exist.';
	}


	/**
	 * Accepts an asset that was uploaded by users, and links it to the DB.
	 * Returns a status code for the file.
	 *
	 * @param {string} user - The user identifier.
	 * @param {AssetData} data - Data for the new asset.
	 */

	async uploadAsset(user: string, data: AssetData): Promise<number> {
		// Validate that the file is the right format, and under the file size limit.
		if (data.file.mimetype !== 'image/png' || data.file.size > uploadLimit || data.file.truncated) return 400;
		// Validate that the identifier and name formats are valid and within the required lengths.
		if (data.identifier.length > 32 || data.name.length > 64 || this.sanitizeName(data.identifier) != data.identifier) return 400;

		// Check that there's space in the user's account and modify their asset space.
		const ret = await this.db!.collection('users').findOneAndUpdate(
			{ user: user, assetSize: { $lte: accountLimit - data.file.size }}, { $inc: { assetSize: data.file.size }});
		if (ret.value === null) return 402;

		// Move the file to the asset directory.

		let assetName = '', assetPath = '';
		while (true) {
			assetName = await getIdentifier(data.identifier) + '.png';
			assetPath = path.join(ASSET_PATH, assetName);
			try { await fs.access(assetPath, fsc.R_OK | fsc.W_OK); }
			catch (e) { if (e.code === 'ENOENT') break; }
		}

		await data.file.mv(assetPath);
		let tokenSize: number | undefined = undefined;
		const size: { width: number, height: number } = await sizeOf(assetPath) as any;

		if (data.type === 'token') {
			if (data.tokenType === 1) tokenSize = Math.round(size.width);
			if (data.tokenType === 4) tokenSize = Math.round(size.width / 2);
			if (data.tokenType === 8) tokenSize = Math.round(size.width / 3);
		}

		await this.db!.collection('assets').insertOne({
			type: data.type,
			user: user,
			identifier: data.identifier,
			name: data.name,
			path: assetName,
			fileSize: data.file.size,
			tileSize: tokenSize ?? 16,
			dimensions: { x: size.width, y: size.height }
		} as DB.Asset);

		await this.db!.collection('collections').findOneAndUpdate({ user: user, identifier: PERSONAL_IDENTIFIER }, {
			$push: {  items: user + ':' + data.identifier }
		}, {upsert: true});

		// console.log((await this.db!.collection('collection.find({})).toArray());

		return 200;
	}


	/**
	 * Deletes a user's asset, removing it from the filesystem.
	 *
	 * @param {string} user - The user identifier.
	 * @param {string} identifier - The asset identifier.
	 */

	async deleteAsset(user: string, identifier: string): Promise<void> {
		const asset: DB.Asset | null = await this.db!.collection('assets').findOne({ user, identifier });
		if (!asset) return;
		
		try { await fs.unlink(path.join(ASSET_PATH, asset.path)) } catch {}
		await this.db!.collection('assets').deleteOne({ user, identifier });
		
		const query = user + ':' + identifier;
		await this.db!.collection('collections').updateMany(
			{ items: { $all: [ query ] } }, { $pull: { items: query } });
	}


	/**
	 * Enables or disables an invite link for a campaign.
	 * If a campaign already has an invite link and this function is called,
	 * it generates a new link and replaces the old one.
	 *
	 * @param {string} user - The identifier of the user performing the operation.
	 * @param {string} identifier - The identifier of the campaign to modify.
	 * @param {boolean} enabled - Whether or not the campaign is open to invitations.
	 */

	async toggleInvite(user: string, identifier: string, enabled: boolean) {
		if (!await this.db!.collection('campaigns').findOne({ user, identifier })) return;

		if (!enabled) await this.db!.collection('invites').deleteOne({ user, identifier });
		else await this.db!.collection('invites').updateOne({ user, identifier}, {
			$set: { user, identifier, token: await getIdentifier(identifier, 8) } }, { upsert: true });
	}


	/**
	 * Gets an invite token for a campaign.
	 * Returns an empty string if the campaign doesn't exist or doesn't have an active invite link.
	 *
	 * @param {string} user - The identifier of the campaign's owner.
	 * @param {string} identifier - The identifier of the campaign.
	 */

	async getInvite(user: string, identifier: string) {
		return (await this.db!.collection('invites').findOne({ user: user, identifier: identifier }))?.token ?? '';
	}


	/**
	 * Accepts an invite for a player, adds a player to the campaign.
	 * Throws if the invite is invalid, or the user is already in the campaign.
	 *
	 * @param {string} user - The user to add to the campaign.
	 * @param {string} token - The invite token for the campaign.
	 */

	async acceptInvite(user: string, token: string) {
		const invite: DB.Invite | null = await this.db!.collection('invites').findOne({ token: token });
		if (!invite) throw 'Invite is no longer valid.';
		if (invite.user === user) throw 'Invite was created by accepting user.';

		const accepted = (await this.db!.collection('campaigns').updateOne({ user: invite.user,
			identifier: invite.identifier, players: { $not: { $all: [ user ]}}}, { $addToSet: { players: user }})).matchedCount !== 0;

		if (!accepted) throw 'Player is already in campaign or campaign doesn\'t exist.';
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

		if (!userObj || !await bcrypt.compare(password, userObj.pass)) throw 'Incorrect email or password.';

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
		if (typeof token !== 'string') {
			if (!token.cookies || !token.cookies.tkn || typeof token.cookies.tkn != 'string')
				throw 'Auth token is no longer valid, please reload the page.';
			token = token.cookies.tkn;
		}
		await this.pruneTokens();
		let inst: DB.AuthToken | null = await this.db!.collection('tokens').findOne({token: token});
		if (!inst) throw 'Auth token is no longer valid, please reload the page.';
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
		if (typeof name != 'string' || name.length < 1) throw 'Name must not be empty.';
		const sanitized = name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
		if (sanitized.length == 0) throw 'Name must include at least one alphanumeric character.';
		return sanitized;
	}
}

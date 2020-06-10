import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { MongoClient, Db } from 'mongodb';

import { DBUser, DBAuthToken, DBCampaign, DBMap } from './DBStructs'

export default class Database {
	client: MongoClient | null = null;
	db: Db | null = null;

	async init() {
		const url = 'mongodb://localhost:3001';
		const dbName = 'vd';
		this.client = new MongoClient(url, { useUnifiedTopology: true });

		await this.client.connect();
		console.log("Successfully connected to MongoDB");

		this.db = this.client.db(dbName);

		// Temp: Delete all users.
		await this.db.collection('users').deleteMany({});
		// await this.db.collection('tokens').deleteMany({});
		await this.db.collection('campaigns').deleteMany({});
	}

	// Create a new user from base data.
	async createUser(user: string, name: string, password: string) {
		const collection = this.db!.collection('users');
		if (await collection.findOne({user: user}) != null) throw "User '" + user + "' already exists!";

		let pass = await bcrypt.hash(password, 10);
		await collection.insertOne({ name: name, user: user, pass: pass });
	}

	// Get a DBUser object from an user string.
	async getUser(user: string): Promise<DBUser> {
		const users = this.db!.collection('users');
		const userObj: DBUser | null = await users.findOne({user: user});
		if (!userObj) throw "User '" + user + "' doesn't exist!";

		return userObj;
	}

	// Get Campaigns of a user from their user string
	async getCampaigns(user: string): Promise<DBCampaign[]> {
		const collection = this.db!.collection('campaigns');
		return (await collection.find({user: user}).toArray())
			.sort((a: DBCampaign, b: DBCampaign) => a.name.charCodeAt(0) < b.name.charCodeAt(0) ? -1 : 1);
	}

	// Get Campaign from the campaign safeName
	async getCampaign(user: string, safeName: string): Promise<DBCampaign> {
		const collection = this.db!.collection('campaigns');
		let camp = await collection.findOne({user: user, safeName: safeName});
		if (!camp) throw "Campaign doesn't exist!";
		return camp;
	}

	// Create a campaign with the name specified. Return the safeName.
	async createCampaign(user: string, name: string): Promise<string> {
		let safeName = name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
		if (safeName.length < 1) throw "Campaign cannot have empty name!";
		const collection = this.db!.collection('campaigns');
		let exists = await collection.findOne({user: user, safeName: safeName});
		if (exists) throw "A campaign of this name already exists.";
		await collection.insertOne({
			user: user,
			name: name,
			safeName: safeName,
			maps: []
		})
		return safeName;
	}

	// Create a campaign with the name specified in a campaign
	async createMap(user: string, campaign: string, map: string) {
		let safeCampaign = campaign.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
		if (safeCampaign.length < 1) throw "Campaign cannot have empty name!";
		let safeName = map.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
		if (safeName.length < 1) throw "Map cannot have empty name!";

		const collection = this.db!.collection('campaigns');
		
		let exists = await collection.findOne({user: user, safeName: safeCampaign});
		if (!exists) throw "A campaign of this name doesn't exist.";
		let mapExists = await collection.findOne({user: user, safeName: safeCampaign, maps: { $elemMatch: {safeName: safeName}}});
		if (mapExists) throw "A map of this name already exists.";

		await collection.updateOne({user: user, safeName: safeCampaign}, {
			$push: {
				maps: {name: map, safeName: safeName, size: {x: 100, y: 100}, tiles: ""}
			}
		});
		return safeName;
	}

	async getMap(user: string, campaign: string, map: string) {
		const collection = this.db!.collection('campaigns');
		let exists = await collection.findOne({user: user, safeName: campaign, maps: { $elemMatch: {safeName: map}}});
		if (!exists) throw "A campaign/map of this name doesn't exist.";
		let mapObj = null;
		for (let i of exists.maps) {
			if (i.safeName == map) { mapObj = i; break; }
		}
		return mapObj;
	}

	// Get an auth token for an email + password pair.
	// Returns a token string if the pair is valid,
	// throws an error otherwise.
	async getAuthToken(user: string, password: string): Promise<string> {
		const users = this.db!.collection('users');
		const userObj: DBUser | null = await users.findOne({user: user.toLowerCase()});

		if (!userObj) throw "User '" + user + "' doesn't exist.";
		if (!await bcrypt.compare(password, userObj.pass)) throw "Incorrect password for user '" + user + "'.";

		const buffer = await crypto.randomBytes(48);
		const token = buffer.toString('hex');

		const tokens = this.db!.collection('tokens');
		const tkn = {user: user, token: token, expires: Date.now() + 60 * 60 * 24 * 3};
		await tokens.insertOne(tkn);

		return token;
	}

	// Validate a token and get the token's account 
	// from either the token string or a POST body.
	async authUser(token: string | any): Promise<string> {
		if (typeof token !== "string") {
			if (!token.cookies || !token.cookies.tkn || typeof token.cookies.tkn != "string") return "";
			token = token.cookies.tkn;
		}

		await this.pruneTokens();

		const tokens = this.db!.collection('tokens');
		let inst: DBAuthToken | null = await tokens.findOne({token: token});
		if (!inst) return "";

		return inst.user;
	}

	// Clear tokens that are past their expiry date.
	private async pruneTokens() {
		const tokens = this.db!.collection('tokens');
		await tokens.deleteMany({expires: {$lt: Date.now()}});
	}
}

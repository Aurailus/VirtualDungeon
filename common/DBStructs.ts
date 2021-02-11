import type { ObjectID } from 'mongodb';

export interface HasID {
	_id: ObjectID;
}

export interface User {
	name: string;
	user: string;
	pass: string;

	assetSize: number;
}

export interface AuthToken {
	user: string;
	token: string;
	expires: number;
}

export interface Campaign {
	user: string;
	identifier: string;
	
	title: string;
	thumbnail?: string;
	description: string;
	
	maps: Map[];
	assets: string[];
	players: string[];
}

/**
 * A campaign item returned from Database.getCampaigns().
 * Maps are optional because players should not get access to that information.
 * Assets are omitted as they are not useful to the client in their raw form.
 */

export interface UserCampaign {
	user: string;
	identifier: string;
	
	title: string;
	thumbnail?: string;
	description: string;
	
	maps?: Map[];
	players: string[];
}

export interface Map {
	name: string;
	identifier: string;
	
	data: string;
}

export type AssetType =	'wall' | 'detail' | 'ground' | 'token';

export interface AssetCollection {
	user: string;
	name: string;
	identifier: string;
	description: string;

	items: string[];
}

export interface Asset {
	type: AssetType;
	user: string;
	identifier: string;
	
	name: string;
	path: string;
	fileSize: number;

	tileSize?: number; // Amount of tiles a token takes (on both axis)
	dimensions: {x: number, y: number} // Image dimensions;
}

export interface Invite {
	user: string;
	identifier: string;

	token: string;
}

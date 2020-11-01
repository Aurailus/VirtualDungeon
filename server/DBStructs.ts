import { ObjectID } from 'mongodb';

export interface User {
	_id?: ObjectID;
	
	name: string;
	user: string;
	pass: string;

	assetSpace: number;
}

export interface AuthToken {
	_id?: ObjectID;

	user: string;
	token: string;
	expires: number;
}

export interface Campaign {
	_id?: ObjectID;

	user: string;
	identifier: string;
	name: string;
	
	maps: Map[];
	assets: AssetListing[];
}

export interface Map {
	_id?: ObjectID;

	identifier: string;
	name: string;
	size: {x: number, y: number};
	tiles: string;
}

export enum AssetType {
	GROUND, WALL, OVERLAY, TOKEN
}

export interface AssetListing {
	_id?: ObjectID;

	user: string;
	group: string;
	identifier?: string;
}

export interface AssetGroup {
	_id?: ObjectID;

	user: string;
	identifier: string;
	name: string;

	contents: Asset[];
}

export interface Asset {
	_id?: ObjectID;
	
	type: AssetType;
	identifier: string;
	name: string;
	
	user: string;
	path: string;
	size: number;

	tileSize: {x: number, y: number};
	spriteSize?: {x: number, y: number};
}

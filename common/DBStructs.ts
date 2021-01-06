import type { ObjectID } from 'mongodb';

export interface User {
	_id?: ObjectID;
	
	name: string;
	user: string;
	pass: string;

	assetSize: number;
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
	
	title: string;
	thumbnail?: string;
	description: string;
	
	maps: Map[];
	assets: string[];
}

export interface Map {
	_id?: ObjectID;

	identifier: string;
	name: string;
	size: {x: number, y: number};
	tiles: string;
}

export type AssetType =	'wall' | 'detail' | 'ground' | 'token';

export interface AssetCollection {
	_id?: ObjectID;

	user: string;
	identifier: string;
	name: string;

	items: string[];
}

export interface Asset {
	_id?: ObjectID;
	
	type: AssetType;
	user: string;
	identifier: string;
	
	name: string;
	path: string;
	fileSize: number;

	tileSize?: number; // Amount of tiles a token takes (on both axis)
	dimensions: {x: number, y: number} // Image dimensions;
}

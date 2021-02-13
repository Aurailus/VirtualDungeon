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

export type TileAssetType =	'wall' | 'detail' | 'floor';
export type TokenAssetType = 'token';
export type AssetType = TileAssetType | TokenAssetType;

export interface AssetCollection {
	user: string;
	name: string;
	identifier: string;
	description: string;

	items: string[];
}

interface BaseAsset {
	user: string;
	identifier: string;
	
	name: string;
	path: string;
	fileSize: number;
	imageSize: {x: number, y: number}
}

export interface TileAsset extends BaseAsset {
	type: TileAssetType;
}

export interface TokenAsset extends BaseAsset {
	type: TokenAssetType;
	tokenType: 1 | 4 | 8;
	tileSize: { x: number, y: number }
}

export type Asset = TileAsset | TokenAsset;

export interface Invite {
	user: string;
	identifier: string;

	token: string;
}

interface BaseUploadData {
	name: string;
	identifier: string;
}

interface TokenUploadData extends BaseUploadData {
	type: 'token';
	tokenType: 1 | 4 | 8;
	tileSize: { x: number; y: number };
}

interface TileUploadData extends BaseUploadData {
	type: 'wall' | 'floor' | 'detail';
}

export type UploadData = TokenUploadData | TileUploadData;

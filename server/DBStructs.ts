import { ObjectID } from 'mongodb';

export interface DBUser {
	_id?: ObjectID;
	
	name: string;
	user: string;
	pass: string;
}

export interface DBAuthToken {
	_id?: ObjectID;

	user: string;
	token: string;
	expires: number;
}

export interface DBCampaign {
	_id?: ObjectID;

	user: string;
	name: string;
	safeName: string;
	maps: DBMap[];
}

export interface DBMap {
	_id?: ObjectID;

	name: string;
	safeName: string;
	size: {x: number, y: number};
	tiles: string;
}

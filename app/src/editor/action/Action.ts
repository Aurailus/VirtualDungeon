import { Vec2 } from '../util/Vec';
import { Layer } from '../util/Layer';
import { TokenData } from '../map/token/Token';

export interface Tile {
	type: 'tile';
	items: TileItem[];
}

export interface TileItem {
	pos: Vec2;
	layer: Layer;
	mapLayer: number;
	tile: { pre: number; post: number };
}

export interface PlaceToken {
	type: 'place_token';
	tokens: TokenData[];
}

export interface ModifyToken {
	type: 'modify_token';
	tokens: { pre: TokenData[]; post: TokenData[] };
}

export interface DeleteToken {
	type: 'delete_token';
	tokens: TokenData[];
}

export type Action = Tile | PlaceToken | ModifyToken | DeleteToken;

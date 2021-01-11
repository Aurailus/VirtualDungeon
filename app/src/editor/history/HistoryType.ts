import { Vec2 } from '../util/Vec';
import { Layer } from '../util/Layer';

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
	tokens: string[];
}

export interface ModifyToken {
	type: 'modify_token';
	tokens: { pre: string[]; post: string[] };
}

export interface DeleteToken {
	type: 'delete_token';
	tokens: string[];
}

export type HistoryType = Tile | PlaceToken | ModifyToken | DeleteToken;

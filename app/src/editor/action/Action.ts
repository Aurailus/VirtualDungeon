import { Vec2 } from '../util/Vec';
import { Layer } from '../util/Layer';
import { TokenRenderData } from '../map/token/Token';

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
	tokens: (TokenRenderData & { uuid: string })[];
}

export interface ModifyToken {
	type: 'modify_token';
	tokens: { uuid: string; pre: TokenRenderData; post: TokenRenderData }[];
}

export interface DeleteToken {
	type: 'delete_token';
	tokens: (TokenRenderData & { uuid: string})[];
}

export type Action = Tile | PlaceToken | ModifyToken | DeleteToken;

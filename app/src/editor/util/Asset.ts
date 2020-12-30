import { Vec2 } from './Vec';

export enum AssetType {
	GROUND, WALL, OVERLAY, TOKEN
}

export interface Asset {
	type: AssetType;
	name: string;
	
	identifier: string;
	key: string;
	path: string;
	size: number;

	tileSize: Vec2;
	spriteSize?: Vec2;
}

import { Vec2 } from './Vec';

export type AssetType = 'ground' | 'wall' | 'token';

export interface Asset {
	type: AssetType;
	name: string;
	
	identifier: string;
	path: string;
	size: number;

	tileSize: number;
	dimensions?: Vec2;
}

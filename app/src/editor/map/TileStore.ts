import * as Phaser from 'phaser';

import { Layer } from '../util/Layer';
import { Asset, AssetType } from '../util/Asset';

interface TileInfo {
	res: number;
	ind: number;
	identifier: string;
}

/**
 * Stores a map of tileset indexes to tiles.
 */

export default class TileStore {
	indices: { [tileset_key: string]: number } = {};
	wallTiles: { [index: number]: TileInfo } = {};
	floorTiles: { [index: number]: TileInfo } = {};
	detailTiles: { [index: number]: TileInfo } = {};

	private currentInd: { [layer in Layer]: number } = { wall: 0, floor: 0, detail: 0 };


	/**
	 * Initializes tilesets from a list of assets.
	 */

	init(textures: Phaser.Textures.TextureManager, assets: Asset[]) {
		for (const tileset of assets.filter(a => a.type !== 'token'))
			this.addTileset(textures, tileset.type, tileset.identifier);
	}


	/**
	 * Adds the specified tileset to the map.
	 */

	private addTileset(textures: Phaser.Textures.TextureManager, layer: AssetType, identifier: string): void {
		const ind = this.currentInd[layer as Layer]++;
		const res = textures.get(identifier).getSourceImage(0).width / 9;

		if (layer === 'wall') this.wallTiles[ind] = { res, ind, identifier };
		else if (layer === 'floor') this.floorTiles[ind] = { res, ind, identifier };
		else if (layer === 'detail') this.detailTiles[ind] = { res, ind, identifier };

		this.indices[identifier] = ind;
	}
}

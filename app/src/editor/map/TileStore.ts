import * as Phaser from 'phaser';

import { Asset, TileAssetType } from '../../../../common/DBStructs';

interface TileInfo {
	res: number;
	ind: number;
	identifier: string;
	type: TileAssetType;
}

/**
 * Stores a map of tileset indexes to tiles.
 */

export default class TileStore {
	private indices: { [ type in TileAssetType]: { [ identifier: string ]: number }} = { floor: {}, wall: {}, detail: {} };
	private tiles: { [ type in TileAssetType]: TileInfo[] } = { floor: [], wall: [], detail: [] };

	/**
	 * Initializes tilesets from a list of assets.
	 */

	init(textures: Phaser.Textures.TextureManager, assets: Asset[]) {
		for (const tile of assets.filter(a => a.type !== 'token'))
			this.addTile(textures, tile.type as TileAssetType, tile.identifier);
	}


	/**
	 * Gets the info for a tile by its index or identifier.
	 * This method is O(1) regardless of the parameter type.
	 *
	 * @param {string | number} identifierOrIndex - The identifier or index of the tile to retrieve.
	 * @returns a TileInfo instance if the tile exists, or undefined.
	 */

	getTile(type: TileAssetType, identiferOrindex: string | number): TileInfo | undefined {
		if (typeof identiferOrindex === 'string') identiferOrindex = this.indices[type][identiferOrindex];
		return this.tiles[type][identiferOrindex - 1];
	}

	/**
	 * Adds the specified tile to the TileStore.
	 *
	 * @param {TextureManager} textures - The Phaser Texture Manager containing the asset.
	 * @param {type} - The tile type that is being added.
	 * @param {identifier} - The identifier of the tile.
	 */

	private addTile(textures: Phaser.Textures.TextureManager, type: TileAssetType, identifier: string): void {
		const ind = this.tiles[type].length + 1;
		const res = textures.get(identifier).getSourceImage(0).width / 9;

		this.tiles[type].push({ ind, res, identifier, type });
		this.indices[type][identifier] = ind;
	}
}

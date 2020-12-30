import type MapScene from './scene/MapScene';

import Layer from './util/Layer';
import { Asset, AssetType } from './util/Asset';

export default class TilesetManager {
	scene: MapScene;

	wallLocations: 		{[index: number]: { res: number; ind: number; key: string }} = {};
	groundLocations: 	{[index: number]: { res: number; ind: number; key: string }} = {};
	overlayLocations: {[index: number]: { res: number; ind: number; key: string }} = {};
	indexes:          {[tileset_key: string]: number} = {};

	private currentWallInd: number = 0;
	private currentGroundInd: number = 0;
	private currentOverlayInd: number = 0;

	constructor(scene: MapScene) {
		this.scene = scene;
	}

	init(assets: Asset[]) {
		for (let tileset of assets.filter(a => a.type === AssetType.WALL   )) this.addTileset(tileset.key, Layer.wall);
		for (let tileset of assets.filter(a => a.type === AssetType.GROUND )) this.addTileset(tileset.key, Layer.floor);
		for (let tileset of assets.filter(a => a.type === AssetType.OVERLAY)) this.addTileset(tileset.key, Layer.overlay);
	}

	private addTileset(key: string, layer: Layer): void {
		let res = this.scene.textures.get(key).getSourceImage(0).width / 9;
		let ind = (layer === Layer.wall ? this.currentWallInd : layer === Layer.floor ? this.currentGroundInd : this.currentOverlayInd);
		this[layer === Layer.wall ? 'wallLocations' : layer === Layer.floor ?
			'groundLocations' : 'overlayLocations'][ind] = { res: res, ind: ind, key: key };
		this.indexes[key] = ind;
		
		if (layer === Layer.wall) this.currentWallInd++;
		else if (layer === Layer.floor) this.currentGroundInd++;
		else this.currentOverlayInd++;
	}
}

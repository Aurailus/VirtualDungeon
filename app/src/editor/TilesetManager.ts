import type MapScene from './scene/MapScene';

import Layer from './util/Layer';
import { Asset } from './util/Asset';

export default class TilesetManager {
	scene: MapScene;

	wallLocations: 		{[index: number]: { res: number; ind: number; identifier: string }} = {};
	groundLocations: 	{[index: number]: { res: number; ind: number; identifier: string }} = {};
	overlayLocations: {[index: number]: { res: number; ind: number; identifier: string }} = {};
	indexes:          {[tileset_key: string]: number} = {};

	private currentWallInd: number = 0;
	private currentGroundInd: number = 0;
	private currentOverlayInd: number = 0;

	constructor(scene: MapScene) {
		this.scene = scene;
	}

	init(assets: Asset[]) {
		for (let tileset of assets.filter(a => a.type === 'wall'   )) this.addTileset(tileset.identifier, Layer.wall);
		for (let tileset of assets.filter(a => a.type === 'ground' )) this.addTileset(tileset.identifier, Layer.floor);
		// for (let tileset of assets.filter(a => a.type === 'overlay')) this.addTileset(tileset.key, Layer.overlay);
	}

	private addTileset(identifier: string, layer: Layer): void {
		let res = this.scene.textures.get(identifier).getSourceImage(0).width / 9;
		let ind = (layer === Layer.wall ? this.currentWallInd : layer === Layer.floor ? this.currentGroundInd : this.currentOverlayInd);
		this[layer === Layer.wall ? 'wallLocations' : layer === Layer.floor ?
			'groundLocations' : 'overlayLocations'][ind] = { res, ind, identifier };
		this.indexes[identifier] = ind;

		if (layer === Layer.wall) this.currentWallInd++;
		else if (layer === Layer.floor) this.currentGroundInd++;
		else this.currentOverlayInd++;
	}
}

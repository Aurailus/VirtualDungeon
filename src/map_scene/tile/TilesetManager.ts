const enum Layer {
	GROUND = 0,
	WALL = 1,
	OVERLAY = 2
}

class TilesetManager {
	scene: MapScene;

	private currentWallInd: number = 0;
	private currentGroundInd: number = 0;
	private currentOverlayInd: number = 0;

	wallLocations: 		{[key: number /*Index*/]: { res: number, ind: number, key: string }} = {};
	groundLocations: 	{[key: number /*Index*/]: { res: number, ind: number, key: string }} = {};
	overlayLocations: {[key: number /*Index*/]: { res: number, ind: number, key: string }} = {};
	canvases:    {[key: number /*Resolution*/]: TilesetCanvas[] } = {};
	indexes:    {[key: string /*Tileset Key*/]: number} = {};

	constructor(scene: MapScene) {
		this.scene = scene;

		for (let tileset of WALLS  )  this.addTileset(tileset.key, Layer.WALL);
		for (let tileset of GROUNDS)  this.addTileset(tileset.key, Layer.GROUND);
		for (let tileset of OVERLAYS) this.addTileset(tileset.key, Layer.OVERLAY);
	}

	private addTileset(key: string, layer: Layer): void {
		let res = this.scene.textures.get(key).getSourceImage(0).width / 9;

		if (this.canvases[res] == undefined)
			this.canvases[res] = [ new TilesetCanvas(this, res, Layer.GROUND), new TilesetCanvas(this, res, Layer.WALL), new TilesetCanvas(this, res, Layer.OVERLAY) ];

		let ind = (layer == Layer.WALL ? this.currentWallInd : layer == Layer.GROUND ? this.currentGroundInd : this.currentOverlayInd);
		let canvas = this.canvases[res];
		this[layer == Layer.WALL ? "wallLocations" : layer == Layer.GROUND ? "groundLocations" : "overlayLocations"][ind] = { res: res, ind: ind, key: key };
		this.indexes[key] = ind;
		canvas[layer].addTileset(key, ind);
		
		layer == Layer.WALL 	? this.currentWallInd++   :
		layer == Layer.GROUND ? this.currentGroundInd++ :
														this.currentOverlayInd++;
	}

	getTilesetRes(tileset: number, layer: Layer): number {
		return layer == Layer.WALL ? this.wallLocations[tileset].res 
				 : layer == Layer.GROUND ? this.groundLocations[tileset].res
				 : this.overlayLocations[tileset].res;
	}

	getGlobalTileIndex(tileset: number, tile: number, layer: Layer): number {
		return this.canvases[this.getTilesetRes(tileset, layer)][layer].getGlobalIndex(tileset, tile);
	}
}

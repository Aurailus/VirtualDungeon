const enum Layer {
	GROUND = 0,
	WALL = 1
}

class TilesetManager {
	scene: MainScene;
	currentInd: number = 0;

	canvases:  {[key: number /*Resolution*/	]: TilesetCanvas[] } = {};
	locations: {[key: number /*Index*/			]: { res: number, layer: Layer, ind: number, key: string }} = {};
	indexes:   {[key: string /*Tileset Key*/]: number} = {};

	constructor(scene: MainScene) {
		this.scene = scene;

		for (let tileset of WALLS  ) this.addTileset(tileset.key, Layer.WALL);
		for (let tileset of GROUNDS) this.addTileset(tileset.key, Layer.GROUND);
	}

	private addTileset(key: string, layer: Layer): void {
		let res = this.scene.textures.get(key).getSourceImage(0).width / 9;

		if (this.canvases[res] == undefined)
			this.canvases[res] = [ new TilesetCanvas(this, res, false), new TilesetCanvas(this, res, true) ];

		let canvas = this.canvases[res];
		this.locations[this.currentInd] = { res: res, layer: layer, ind: this.currentInd, key: key };
		this.indexes[key] = this.currentInd;
		canvas[layer].addTileset(key);
	}

	getTilesetRes(tileset: number): number {
		return this.locations[tileset].res;
	}

	getGlobalTileIndex(tileset: number, tile: number, layer: Layer): number {
		return this.canvases[this.getTilesetRes(tileset)][layer].getGlobalIndex(tileset, tile);
	}
}

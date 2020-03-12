interface ResTilesets {
	wall: TilesetCanvas;
	ground: TilesetCanvas;
}

class TilesetManager {
	scene: MainScene;
	currentInd: number = 0;

	canvases:  {[key: number /*Resolution*/	]: ResTilesets} = {};
	locations: {[key: number /*Index*/			]: { res: number, wall: boolean, ind: number, key: string }} = {};
	indexes:   {[key: string /*Tileset Key*/]: number} = {};

	constructor(scene: MainScene) {
		this.scene = scene;

		for (let tileset of WALLS  ) this.addTileset(tileset.key, true);
		for (let tileset of GROUNDS) this.addTileset(tileset.key, false);
	}

	addTileset(key: string, wall: boolean) {
		let res = this.scene.textures.get(key).getSourceImage(0).width / 9;

		if (this.canvases[res] == undefined) {
			this.canvases[res] = {
				wall: new TilesetCanvas(this, res, true),
				ground: new TilesetCanvas(this, res, false)
			} as ResTilesets;
		}

		let canvas = this.canvases[res];
		this.locations[this.currentInd] = { res: res, wall: wall, ind: this.currentInd, key: key };
		this.indexes[key] = this.currentInd;
		canvas[wall ? "wall" : "ground"].addTileset(key);
	}
}

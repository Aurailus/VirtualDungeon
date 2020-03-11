interface ResTilesets {
	wall: TilesetCanvas;
	ground: TilesetCanvas;
}

class TilesetManager {
	scene: MainScene;

	tilesets: {[key: number]: ResTilesets} = {};
	locations: {[key: number]: { res: number, wall: boolean, ind: number }} = {};
	currentInd: number = 0;

	constructor(scene: MainScene) {
		this.scene = scene;
	}

	addTileset(key: string, wall: boolean) {
		let res = this.scene.textures.get(key).getSourceImage(0).width / 9;

		if (this.tilesets[res] == undefined) {
			this.tilesets[res] = {
				wall: new TilesetCanvas(this, res, true),
				ground: new TilesetCanvas(this, res, false)
			} as ResTilesets;
		}

		let tilesetCanvas = this.tilesets[res];
		this.locations[this.currentInd] = { res: res, wall: wall, ind: this.currentInd };
		tilesetCanvas[wall ? "wall" : "ground"].addTileset(key);
	}
}

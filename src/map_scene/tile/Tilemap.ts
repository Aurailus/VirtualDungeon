class Tilemap {
	scene: MapScene;
	map: Phaser.Tilemaps.Tilemap;
	dimensions: Vec2 = new Vec2();

	manager: TilesetManager;
	layers: {[key: number]: Phaser.Tilemaps.DynamicTilemapLayer[]} = {};

	groundAt: number[][];
	wallAt:   number[][];

	constructor(key: string, scene: MapScene, xwid: number, ywid: number) {
		this.scene = scene;
		this.dimensions = new Vec2(xwid, ywid);

		this.groundAt = [];
		this.wallAt = [];
		for (let i = 0; i < xwid; i++) {
			this.groundAt[i] = [];
			this.wallAt[i] = [];
			for (let j = 0; j < ywid; j++) {
				this.groundAt[i][j] = -1;
				this.wallAt[i][j] = -1;
			}
		}

		this.manager = new TilesetManager(scene);

		this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);

		for (let res of Object.keys(this.manager.canvases)) this.createLayers(parseInt(res));

		for (let x = 0; x < this.dimensions.x; x ++) {
			for (let y = 0; y < this.dimensions.y; y ++) {
				this.setTileRaw(x, y, 1, 54 + Math.floor(Math.random() * 6), Layer.GROUND);
			}
		}
		
		this.map.addTilesetImage("grid_tile", "grid_tile", 16, 16, 0, 0);
		this.map.setLayer("grid");
		let gridlayer = this.map.createBlankDynamicLayer("grid", "grid_tile", 0, 0, this.dimensions.x, this.dimensions.y, 16, 16);
		gridlayer.setScale(4, 4);
		gridlayer.setDepth(500);
		for (let i = 0; i < xwid; i++) {
			for (let j = 0; j < ywid; j++) {
				if ((j % 2 == 0 && i % 2 == 0) || (j % 2 != 0 && i % 2 != 0)) gridlayer.putTileAt(0, i, j);
			}
		}	
	}

	private createLayers(res: number) {
		this.map.addTilesetImage("tileset_" + res + "_ground", "tileset_" + res + "_ground", res, res, 0, 4);
		this.map.addTilesetImage("tileset_" + res + "_wall", "tileset_" + res + "_wall", res, res, 0, 4);

		this.map.setLayer("layer_" + res + "_ground");
		let ground = this.map.createBlankDynamicLayer("layer_" + res + "_ground", 
			"tileset_" + res + "_ground", 0, 0, this.dimensions.x, this.dimensions.y, res, res);
		ground.setScale(4 / (res / 16), 4 / (res / 16));
		ground.setDepth(-1000 + res);

		this.map.setLayer("layer_" + res + "_wall");
		let wall = this.map.createBlankDynamicLayer("layer_" + res + "_wall", 
			"tileset_" + res + "_wall", 0, 0, this.dimensions.x, this.dimensions.y, res, res);
		wall.setScale(4 / (res / 16), 4 / (res / 16));
		wall.setDepth(-500 + res);

		this.layers[res] = [ground, wall];
	}

	getWall(x: number, y: number): number {
		return this.wallAt[clamp(x, 0, this.dimensions.x - 1)][clamp(y, 0, this.dimensions.y - 1)];
	}

	setWall(x: number, y: number, tileset: number): boolean {
		return this.setTile(x, y, tileset, Layer.WALL);
	}

	getGround(x: number, y: number): number {
		return this.groundAt[clamp(x, 0, this.dimensions.x - 1)][clamp(y, 0, this.dimensions.y - 1)];
	}

	setGround(x: number, y: number, tileset: number): boolean {
		return this.setTile(x, y, tileset, Layer.GROUND);
	}

	private setTile(x: number, y: number, tileset: number, layer: Layer): boolean {
		if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1) return false;
		
		let arr = (layer == Layer.GROUND ? this.groundAt : this.wallAt);
		if (arr[x][y] == tileset) return false;

		if (arr[x][y] != -1) this.layers[this.manager.getTilesetRes(arr[x][y])][layer].removeTileAt(x, y, true);
		if (tileset != -1) this.layers[this.manager.getTilesetRes(tileset)][layer].putTileAt(
			this.manager.getGlobalTileIndex(tileset, (layer == Layer.GROUND ? 54 : 13), layer), x, y);

		arr[x][y] = tileset;
		
		this.calculateSmartTilesAround(x, y);
		return true;
	}

	private setTileRaw(x: number, y: number, tileset: number, tile: number, layer: Layer): void {
		let arr = (layer == Layer.GROUND ? this.groundAt : this.wallAt);
		let loc = this.manager.locations[tileset].res;

		if (arr[x][y] != -1) {
			this.layers[loc][layer].removeTileAt(x, y, true);
			arr[x][y] = -1;
		}

		this.layers[loc][layer].putTileAt(this.manager.canvases[loc][layer].getGlobalIndex(tileset, tile), x, y);
		arr[x][y] = tileset;
	}

	private calculateSmartTilesAround(x: number, y: number) {
		for (let i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x - 1, 0); i++) {
			for (let j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y - 1, 0); j++) {
				let wall = SmartTiler.wall(this.getWallsAround(i, j), this.wallAt[i][j]);
				if (wall != -1) this.setTileRaw(i, j, this.wallAt[i][j], wall, Layer.WALL);

				let ground = SmartTiler.ground(this.getWallsAround(i, j), this.groundAt[i][j]);
				if (ground != -1) this.setTileRaw(i, j, this.groundAt[i][j], ground, Layer.GROUND);
			}
		}
	}

	private getWallsAround(x: number, y: number): boolean[] {
		let solid: boolean[] = [];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				solid.push(this.getWall(x + j, y + i) != -1);
			}
		}
		return solid;
	}
}
 

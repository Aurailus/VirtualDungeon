class Tilemap {
	scene: MapScene;
	map: Phaser.Tilemaps.Tilemap;
	dimensions: Vec2 = new Vec2();

	manager: TilesetManager;
	layers: {[key: number]: Phaser.Tilemaps.DynamicTilemapLayer[]} = {};
	fogOfWarLayer: Phaser.Tilemaps.DynamicTilemapLayer;

	groundAt:  number[][];
	wallAt:    number[][];
	overlayAt: number[][];

	fogOfWarAt: boolean[][];

	constructor(key: string, scene: MapScene, xwid: number, ywid: number) {
		this.scene = scene;
		this.dimensions = new Vec2(xwid, ywid);

		this.groundAt = [];
		this.wallAt = [];
		this.overlayAt = [];
		this.fogOfWarAt = [];
		for (let i = 0; i < xwid; i++) {
			this.groundAt[i] = [];
			this.wallAt[i] = [];
			this.overlayAt[i] = [];
			this.fogOfWarAt[i] = [];
			for (let j = 0; j < ywid; j++) {
				this.groundAt[i][j] = -1;
				this.wallAt[i][j] = -1;
				this.overlayAt[i][j] = -1;
				this.fogOfWarAt[i][j] = true;
			}
		}

		this.manager = new TilesetManager(scene);

		this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);

		for (let res of this.manager.resolutions()) this.createLayers(parseInt(res));

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
		
		this.map.addTilesetImage("shadow_overlay", "wall_shadow", 16, 16, 0, 0);
		this.map.setLayer("shadow_overlay");
		this.fogOfWarLayer = this.map.createBlankDynamicLayer("shadow_overlay", "shadow_overlay", 0, 0, this.dimensions.x, this.dimensions.y, 16, 16);
		this.fogOfWarLayer.setScale(4, 4);
		this.fogOfWarLayer.setDepth(900);
		// this.fogOfWarLayer.setAlpha(0.5);
		for (let i = 0; i < xwid; i++) {
			for (let j = 0; j < ywid; j++) {
				this.fogOfWarLayer.putTileAt(54, i, j);
			}
		}	
	}

	recalculateLighting(prevSerialized: string[]): void {
		let dist = 8;

		for (let ser of prevSerialized) {
			let tbl: SerializedToken = JSON.parse(ser);

			let tileX = Math.floor(tbl.x / 16);
			let tileY = Math.floor(tbl.y / 16);

			for (let i = clamp(tileX - dist - 1, this.dimensions.x - 1, 0); i <= clamp(tileX + dist + 1, this.dimensions.x - 1, 0); i++) {
				for (let j = clamp(tileY - dist - 1, this.dimensions.y - 1, 0); j <= clamp(tileY + dist + 1, this.dimensions.y - 1, 0); j++) {
					this.setFogOfWarRaw(i, j, 54);
				}
			}
		}

		for (let tkn of this.scene.tokens) {
			let tileX = Math.floor(tkn.x / 64);
			let tileY = Math.floor(tkn.y / 64);

			let t = new ViewTrace(this, dist);
			for (let tr of t.go(tileX, tileY)) {
					this.setFogOfWar(tr.x, tr.y, false);
			}

			// for (let i = clamp(tileX - dist, this.dimensions.x - 1, 0); i <= clamp(tileX + dist, this.dimensions.x - 1, 0); i++) {
			// 	for (let j = clamp(tileY - dist, this.dimensions.y - 1, 0); j <= clamp(tileY + dist, this.dimensions.y - 1, 0); j++) {
			// 	}
			// }
		}
	}

	private createLayers(res: number) {
		this.map.addTilesetImage("tileset_" + res + "_ground", 	"tileset_" + res + "_ground",  res, res, 2, 4);
		this.map.addTilesetImage("tileset_" + res + "_wall", 		"tileset_" + res + "_wall", 	 res, res, 2, 4);
		this.map.addTilesetImage("tileset_" + res + "_overlay", "tileset_" + res + "_overlay", res, res, 2, 4);

		this.map.setLayer("layer_" + res + "_ground");
		let ground = this.map.createBlankDynamicLayer("layer_" + res + "_ground", 
			"tileset_" + res + "_ground", 0, 0, this.dimensions.x, this.dimensions.y, res, res);
		ground.setScale(4 / (res / 16), 4 / (res / 16));
		ground.setDepth(-1500 + res);

		this.map.setLayer("layer_" + res + "_overlay");
		let overlay = this.map.createBlankDynamicLayer("layer_" + res + "_overlay", 
			"tileset_" + res + "_overlay", 0, 0, this.dimensions.x, this.dimensions.y, res, res);
		overlay.setScale(4 / (res / 16), 4 / (res / 16));
		overlay.setDepth(-1000 + res);

		this.map.setLayer("layer_" + res + "_wall");
		let wall = this.map.createBlankDynamicLayer("layer_" + res + "_wall", 
			"tileset_" + res + "_wall", 0, 0, this.dimensions.x, this.dimensions.y, res, res);
		wall.setScale(4 / (res / 16), 4 / (res / 16));
		wall.setDepth(-500 + res);

		this.layers[res] = [ground, wall, overlay];
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

	getOverlay(x: number, y: number): number {
		return this.overlayAt[clamp(x, 0, this.dimensions.x - 1)][clamp(y, 0, this.dimensions.y - 1)];
	}

	setOverlay(x: number, y: number, tileset: number): boolean {
		return this.setTile(x, y, tileset, Layer.OVERLAY);
	}

	getTile(x: number, y: number, layer: Layer) {
		return (layer == Layer.WALL ? this.getWall(x, y) : layer == Layer.GROUND ? this.getGround(x, y) : this.getOverlay(x, y));
	}

	setTile(x: number, y: number, tileset: number, layer: Layer): boolean {
		if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1) return false;
		
		let arr = (layer == Layer.GROUND ? this.groundAt : layer == Layer.WALL ? this.wallAt : this.overlayAt);
		if (arr[x][y] == tileset) return false;

		if (arr[x][y] != -1) {
			this.layers[this.manager.getTilesetRes(arr[x][y], layer)][layer].removeTileAt(x, y, true);
			arr[x][y] = -1;
		}
		if (tileset != -1) this.layers[this.manager.getTilesetRes(tileset, layer)][layer].putTileAt(
			this.manager.getGlobalTileIndex(tileset, 0, layer), x, y);

		arr[x][y] = tileset;
		
		this.calculateSmartTilesAround(x, y);
		return true;
	}

	private setTileRaw(x: number, y: number, tileset: number, tile: number, layer: Layer): void {
		let arr = (layer == Layer.GROUND ? this.groundAt : layer == Layer.WALL ? this.wallAt : this.overlayAt);

		if (arr[x][y] != -1) {
			this.layers[this.manager.getTilesetRes(arr[x][y], layer)][layer].removeTileAt(x, y, true);
			arr[x][y] = -1;
		}

		let loc = this.manager.getTilesetRes(tileset, layer);
		this.layers[loc][layer].putTileAt(this.manager.getGlobalTileIndex(tileset, tile, layer), x, y);
		arr[x][y] = tileset;
	}

	private getTileAt(x: number, y: number, layer: number): number {
		let arr = (layer == Layer.GROUND ? this.groundAt : layer == Layer.WALL ? this.wallAt : this.overlayAt);
		if (arr[x][y] == -1) return -1;
		return this.manager.getLocalTileIndex(arr[x][y], this.layers[this.manager.getTilesetRes(arr[x][y], layer)][layer].getTileAt(x, y, true).index, layer);
	}

	private calculateSmartTilesAround(x: number, y: number): void {
		for (let i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x - 1, 0); i++) {
			for (let j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y - 1, 0); j++) {

				let wall = SmartTiler.wall(this.getWallsAround(i, j), this.getTileAt(i, j, Layer.WALL));
				if (wall != -1) this.setTileRaw(i, j, this.wallAt[i][j], wall, Layer.WALL);

				let ground = SmartTiler.ground(this.getWallsAround(i, j), this.getTileAt(i, j, Layer.GROUND));
				if (ground != -1) this.setTileRaw(i, j, this.groundAt[i][j], ground, Layer.GROUND);

				let overlay = SmartTiler.overlay(this.getOverlaysAround(i, j, this.overlayAt[i][j]), this.getTileAt(i, j, Layer.OVERLAY));
				if (overlay != -1) this.setTileRaw(i, j, this.overlayAt[i][j], overlay, Layer.OVERLAY);
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

	private getOverlaysAround(x: number, y: number, targetTileset: number): boolean[] {
		let solid: boolean[] = [];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				solid.push(this.getOverlay(x + j, y + i) == targetTileset);
			}
		}
		return solid;
	}

	private setFogOfWar(x: number, y: number, war: boolean): void {
		if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1) return;

		if (this.fogOfWarAt[x][y]) this.fogOfWarLayer.removeTileAt(x, y, true);
		if (war) this.fogOfWarLayer.putTileAt(54, x, y);

		this.fogOfWarAt[x][y] = war;
		
		this.calculateFogOfWarSmart(x, y);
	}

	private calculateFogOfWarSmart(x: number, y: number): void {
		for (let i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x - 1, 0); i++) {
			for (let j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y - 1, 0); j++) {

				let fog = SmartTiler.fogOfWar(this.getFogOfWarAround(i, j));
				if (fog != -1) this.setFogOfWarRaw(i, j, fog);
			}
		}
	}

	private getFogOfWarAround(x: number, y: number): boolean[] {
		let fog: boolean[] = [];

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				fog.push(this.fogOfWarAt[clamp(x + j, 0, this.dimensions.x)][clamp(y + i, 0, this.dimensions.y)]);
			}
		}
		return fog;
	}

	private setFogOfWarRaw(x: number, y: number, tile: number): void {
		if (this.fogOfWarAt[x][y] != false) this.fogOfWarLayer.removeTileAt(x, y, true);
		this.fogOfWarAt[x][y] = true;
		this.fogOfWarLayer.putTileAt(tile, x, y);
	}
}
 

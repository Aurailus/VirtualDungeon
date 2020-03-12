class Tilemap {
	scene: MainScene;
	map: Phaser.Tilemaps.Tilemap;
	dimensions: Vec2 = new Vec2();

	manager: TilesetManager;
	layers: {[key: number]: {wall: Phaser.Tilemaps.DynamicTilemapLayer, ground: Phaser.Tilemaps.DynamicTilemapLayer}} = {};

	SOLID: number = 10;

	groundAt: number[][];
	wallAt:   number[][];

	constructor(key: string, scene: MainScene, xwid: number, ywid: number) {
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
		for (let tileset of WALLS  ) this.manager.addTileset(tileset.key, true);
		for (let tileset of GROUNDS) this.manager.addTileset(tileset.key, false);

		this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);

		for (let res of Object.keys(this.manager.tilesets)) this.createLayers(parseInt(res));

		for (let x = 0; x < this.dimensions.x; x ++) {
			for (let y = 0; y < this.dimensions.y; y ++) {
				this.layers[16].ground.putTileAt(3, x, y);
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
		this.map.addTilesetImage("tileset_" + res + "_ground", "tileset_" + res + "_ground", res, res, 0, 0);
		this.map.addTilesetImage("tileset_" + res + "_wall", "tileset_" + res + "_wall", res, res, 0, 0);

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

		this.layers[res] = { ground: ground, wall: wall };
	}

	setWall(x: number, y: number, tileset: number): boolean {
		if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1) return false;

		if (this.wallAt[x][y] == tileset) return false;

		if (this.wallAt[x][y] != -1) {
			this.layers[this.manager.locations[this.wallAt[x][y]].res].wall.removeTileAt(x, y, true);
			this.wallAt[x][y] = -1;
		}

		if (tileset != -1) {
			this.layers[this.manager.locations[tileset].res].wall.putTileAt(
				this.manager.tilesets[this.manager.locations[tileset].res].wall.getGlobalIndex(54, tileset), x, y);
			this.wallAt[x][y] = tileset;
		}
		
		this.calculateSmartTilesAround(x, y);
		return true;
	}

	private setWallRaw(x: number, y: number, tileset: number, tile: number) {
		if (this.wallAt[x][y] != -1) {
			this.layers[this.manager.locations[tileset].res].wall.removeTileAt(x, y, true);
			this.wallAt[x][y] = -1;
		}

		this.layers[this.manager.locations[tileset].res].wall.putTileAt(
			this.manager.tilesets[this.manager.locations[tileset].res].wall.getGlobalIndex(tile, tileset), x, y);
		this.wallAt[x][y] = tileset;
	}

	getWall(x: number, y: number): number {
		return this.wallAt[clamp(x, 0, this.dimensions.x - 1)][clamp(y, 0, this.dimensions.y - 1)];
	}

	getGround(x: number, y: number): number {
		return this.groundAt[clamp(x, 0, this.dimensions.x - 1)][clamp(y, 0, this.dimensions.y - 1)];
	}

	private calculateSmartTilesAround(x: number, y: number) {
		for (let i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x - 1, 0); i++) {
			for (let j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y - 1, 0); j++) {
				let tile = this.calculateSmartTile(i, j);
				if (tile != -1) this.setWallRaw(i, j, this.wallAt[i][j], tile);
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

	private calculateSmartTile(x: number, y: number): number {
		let wall = this.getWall(x, y); 
		if (wall == -1) return -1;

		const TL = 0, T = 1, TR = 2, L = 3, C = 4, R = 5, BL = 6, B = 7, BR = 8;

		let empty = this.getWallsAround(x, y).map(b => !b);
		let tile = 54;

		if (empty[T]) {
			if (empty[B]) {
				if (empty[L]) {
					if (empty[R]) tile = 33;
					else tile = 15; 
				}
				else if (empty[R]) tile = 5;
				else tile = 2;
			}
			else if (empty[L]) {
				if (empty[R]) tile = 14;
				else if (empty[BR]) tile = 0;
				else tile = 7;
			}
			else if (empty[R]) {
				if (empty[BL]) tile = 1;
				else tile = 8;
			}
			else {
				if (empty[BL]) {
					if (empty[BR]) tile = 3;
					else tile = 40;
				}
				else if (empty[BR]) tile = 41;
				else tile = 31;
			}
		}
		else if (empty[B]) {
			if (empty[L]) {
				if (empty[R]) tile = 6;
				else if (empty[TR]) tile = 9;
				else tile = 16;
			}
			else if (empty[R]) {
				if (empty[TL]) tile = 10;
				else tile = 17;
			}
			else {
				if (empty[TL]) {
					if (empty[TR]) tile = 4;
					else tile = 49;
				}
				else if (empty[TR]) tile = 50;
				else tile = 32;
			}
		}
		else if (empty[L]) {
			if (empty[R]) tile = 11;
			else {
				if (empty[TR]) {
					if (empty[BR]) tile = 12;
					else tile = 38;
				}
				else if (empty[BR]) tile = 47;
				else tile = 22;
			}
		}
		else if (empty[R]) {
			if (empty[TL]) {
				if (empty[BL]) tile = 13;
				else tile = 39;
			}
			else if (empty[BL]) tile = 48;
			else tile = 23;
		}
		else if (empty[TL]) {
			if (empty[TR]) {
				if (empty[BL]) {
					if (empty[BR]) tile = 25;
					else tile = 36;
				}
				else if (empty[BR]) tile = 37; 
				else tile = 21;
			}
			else if (empty[BL]) {
				if (empty[BR]) tile = 45;
				else tile = 30;
			}
			else if (empty[BR]) tile = 51;
			else tile = 21;
		}
		else if (empty[TR]) {
			if (empty[BL]) {
				if (empty[BR]) tile = 46;
				else tile = 42;
			}
			else if (empty[BR]) tile = 29;
			else tile = 27;
		}
		else if (empty[BL]) {
			if (empty[BR]) tile = 20;
			else tile = 19;
		}
		else if (empty[BR]) tile = 18;
		else {
			if (wall >= 54 && wall <= 60) return -1;
			tile = 54 + Math.floor(Math.random() * 6);
		}

		return tile;
	}
}
 

class Tilemap {
	scene: MainScene;

	key: string;
	dimensions: {x: number, y: number};

	SOLID: number = 10;

	map: Phaser.Tilemaps.Tilemap;
	layers: (Phaser.Tilemaps.DynamicTilemapLayer | null)[] = [];

	solid_at: boolean[][];
	palette_at: number[][];

	constructor(key: string, scene: MainScene, xwid: number, ywid: number) {
		this.key = key;
		this.scene = scene;
		this.dimensions = {x: xwid, y: ywid};

		this.solid_at = [];
		this.palette_at = [];
		for (let i = 0; i < xwid; i++) {
			this.solid_at[i] = [];
			this.palette_at[i] = [];
			for (let j = 0; j < ywid; j++) {
				this.solid_at[i][j] = false;
				this.palette_at[i][j] = 1;
			}
		}

		this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);

		for (let i = 0; i < this.scene.TILESET_COUNT; i++) {
			let tileset = this.map.addTilesetImage("tileset_" + i, "tileset_" + i, 16, 16, 0, 0);

			this.layers[i] = null;
		}
		this.createLayer(0);
		this.layers[0].setInteractive();
		
		this.map.addTilesetImage("grid_tile", "grid_tile", 16, 16, 0, 0);
		this.map.setLayer("grid");
		let gridlayer = this.map.createBlankDynamicLayer("grid", "grid_tile", 0, 0, 50*16, 50*16, 16, 16);
		gridlayer.setScale(4, 4);
		gridlayer.setDepth(500);
		for (let i = 0; i < xwid; i++) {
			for (let j = 0; j < ywid; j++) {
				if ((j % 2 == 0 && i % 2 == 0) || (j % 2 != 0 && i % 2 != 0)) gridlayer.putTileAt(0, i, j);
			}
		}

		for (let x = 0; x < this.dimensions.x; x ++) {
			for (let y = 0; y < this.dimensions.y; y ++) {
				this.setTile(x, y, 1, 13);
			}
		}
	}

	private createLayer(palette: number) {
		this.map.setLayer("layer_" + palette);
		this.layers[palette] = this.map.createBlankDynamicLayer("layer_" + palette, "tileset_" + palette, 0, 0, 50*16, 50*16, 16, 16);
		this.layers[palette].setScale(4, 4);
		this.layers[palette].setDepth(-500 + palette);
	}

	setSolid(x: number, y: number, palette: number, solid: boolean): boolean {
		if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1) return false;

		let oldPalette = this.palette_at[x][y];
		let wasSolid 	 = this.solid_at[x][y];

		if (wasSolid == solid && palette == oldPalette) return false;
		
		this.setTile(x, y, palette, (solid ? this.SOLID : 13));
		this.calculateEdgesAround(x, y);

		return true;
	}

	getSolid(x: number, y: number): number {
		if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1) return -1;
		return (this.solid_at[x][y]) ? this.palette_at[x][y] : -1;
	}

	getPalette(x: number, y: number): number {
		if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1) return -1;
		return this.palette_at[x][y];
	}

	private setTile(x: number, y: number, palette: number, tid: number): void {
		if (this.layers[palette] == null) this.createLayer(palette);

		this.layers[this.palette_at[x][y]].removeTileAt(x, y, true);
		this.layers[palette].putTileAt(tid, x, y);
		this.palette_at[x][y] = palette;
		this.solid_at[x][y] = tid == this.SOLID;
	}

	private calculateEdgesAround(x: number, y: number) {
		for (let i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x - 1, 0); i++) {
			for (let j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y - 1, 0); j++) {
				let tile = this.calculateSmartTile(i, j);
				if (tile != -1) this.setTile(i, j, this.palette_at[i][j], tile);
			}
		}
	}

	private getSurroundingSolid(x: number, y: number): boolean[] {
		let solid: boolean[] = [];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				solid.push(this.getSolid(x + j, y + i) != -1);
			}
		}
		return solid;
	}

	private calculateSmartTile(x: number, y: number): number {
		if (this.getSolid(x, y) != -1) return -1;

		let adjacents = this.getSurroundingSolid(x, y);
		let tile = 13;

		if (adjacents[7] /*Bottom*/) { 
		 	if (adjacents[1] /*Top*/) {
		 		if (adjacents[5] /*Right*/) { 
		 			if (adjacents[3] /*Left*/) tile = 49;
		 			else tile = 59;
		 		}
		 		else if (adjacents[3] /*Left*/) tile = 57;
		 		else tile = 58;
		 	}
			else if (adjacents[3] /*Left*/) {
				if (adjacents[5] /*Right*/) tile = 48;
				else if (adjacents[2] /*Top right*/) tile = 45;
				else tile = 21;
			}
			else if (adjacents[5] /*Right*/) {
				if (adjacents[0] /*Top left*/) tile = 47;
				else tile = 23;
			}
			else if (adjacents[0] /*Top left*/) {
				if (adjacents[2] /*Top Right*/) tile = 46;
				else tile = 41;
			}
			else if (adjacents[2] /*Top Right*/) tile = 40;
		 	else tile = 1;
		}
		else if (adjacents[1] /*Top*/) {
			if (adjacents[3] /*Left*/) {
				if (adjacents[5] /*Right*/) tile = 30;
				else if (adjacents[8] /*Bottom right*/) tile = 27;
				else tile = 3;
			}
			else if (adjacents[5] /*Right*/) {
				if (adjacents[6] /*Bottom left*/) tile = 29; 
				else tile = 5;
			}
			else if (adjacents[6] /*Bottom left*/) {
				if (adjacents[8] /*Bottom right*/) tile = 28;
				else tile = 32;
			}
			else if (adjacents[8] /*Bottom right*/) tile = 31;
			else tile = 19;
		}
		else if (adjacents[3] /*Left*/) {
			if (adjacents[5] /*Right*/) tile = 39;
			else if (adjacents[2] /*Top right*/) {
				if (adjacents[8] /*Bottom right*/) tile = 36;
				else tile = 51;
			}
			else if (adjacents[8] /*Bottom right*/) tile = 42;
			else tile = 11;
		}
		else if (adjacents[5] /*Right*/) {
			if (adjacents[0] /*Top left*/) {
				if (adjacents[6] /*Bottom left*/) tile = 38;
				else tile = 52;
			}
			else if (adjacents[6] /*Bottom left*/) tile = 43;
			else tile = 9;
		}
		else if (adjacents[0] /*Top Left*/) {
			if (adjacents[2] /*Top right*/) {
				if (adjacents[6] /*Bottom left*/) {
					if (adjacents[8] /*Bottom right*/) tile = 37;
					else tile = 6;
				}
				else if (adjacents[8] /*Bottom right*/) tile = 7;
				else tile = 4;
			}
			else if (adjacents[6] /*Bottom left*/) {
				if (adjacents[8] /*Bottom right*/) tile = 15;
				else tile = 12;
			}
			else if (adjacents[8] /*Bottom right*/) tile = 33;
			else tile = 20;
		}
		else if (adjacents[2] /*Top right*/) {
			if (adjacents[6] /*Bottom left*/) {
				if (adjacents[8] /*Bottom right*/) tile = 16;
				else tile = 34;
			}
			else if (adjacents[8] /*Bottom right*/) tile = 14;
			else tile = 18; 
		}
		else if (adjacents[6] /*Bottom left*/) {
			if (adjacents[8] /*Bottom Right*/) tile = 22;
			else tile = 2;
		}
		else if (adjacents[8] /*Bottom right*/) tile = 0;

		return tile;
	}
}
 

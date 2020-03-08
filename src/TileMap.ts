class TileMap {
	scene: Phaser.Scene;

	key: string;
	dimensions: {x: number, y: number}

	SOLID: number = 10;

	map: Phaser.Tilemaps.Tilemap;
	layer: Phaser.Tilemaps.DynamicTilemapLayer;

	constructor(key: string, scene: Phaser.Scene, xwid: number, ywid: number) {
		this.key = key;
		this.scene = scene;
		this.dimensions = {x: xwid, y: ywid};

		this.map = this.scene.add.tilemap(null, 16, 16, 50 * 16, 50 * 16);
		let tileset = this.map.addTilesetImage("tileset", "tileset", 16, 16, 0, 0);
		this.layer = this.map.createBlankDynamicLayer("layer", "tileset", 0, 0, 50 * 16, 50 * 16, 16, 16);

		this.layer.setScale(4, 4);
	}

	fillMap(tid?: number): void {
		if (!tid) tid = this.SOLID;

		for (let x = 0; x < this.dimensions.x; x ++) {
			for (let y = 0; y < this.dimensions.y; y ++) {
				this.setTile(x, y, tid);
			}
		}
	}

	setSolid(x: number, y: number, solid: boolean): void {
		let alreadySolid = this.getSolid(x, y);
		if (alreadySolid == solid) return;

		if (solid) this.setTile(x, y, this.SOLID);
		else this.setTile(x, y, 13);

		this.calculateEdgesAround(x, y);
	}

	getSolid(x: number, y: number) {
		return this.getTile(x, y) == this.SOLID;
	}

	private setTile(x: number, y: number, tid: number): void {
		this.layer.removeTileAt(x, y, true);
		this.layer.putTileAt(tid, x, y);
	}

	private getTile(x: number, y: number): number {
		if (x < 0 || y < 0 || x > this.dimensions.x - 1 || y > this.dimensions.y - 1) return this.SOLID;
		return this.layer.getTileAt(x, y, true).index;
	}

	private calculateEdgesAround(x: number, y: number) {
		for (let i = clamp(x - 1, this.dimensions.x - 1, 0); i <= clamp(x + 1, this.dimensions.x + 1, 0); i++) {
			for (let j = clamp(y - 1, this.dimensions.y - 1, 0); j <= clamp(y + 1, this.dimensions.y + 1, 0); j++) {
				this.calculateEdges(i, j);
			}
		}
	}

	private getSurroundingTiles(x: number, y: number): number[] {
		let tiles: number[] = [];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				tiles.push(this.getTile(x + j, y + i));
			}
		}
		return tiles;
	}

	private getSurroundingSolid(x: number, y: number): boolean[] {
		let tiles: (number|boolean)[] = this.getSurroundingTiles(x, y);
		for (let i = 0; i < 9; i++) {
			tiles[i] = (tiles[i] == this.SOLID);
		}
		return tiles as boolean[];
	}

	private calculateEdges(x: number, y: number): void {
		if (this.getTile(x, y) == this.SOLID) return;

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

		this.setTile(x, y, tile);
	}
}
 

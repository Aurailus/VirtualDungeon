class TilesetCanvas {
	manager: TilesetManager;

	res: number;
	width: number;
	height: number;
	
	canvas: Phaser.Textures.CanvasTexture;

	indexes: number[] = [];
	indMap: number[] = [];

	constructor(manager: TilesetManager, res: number, wall: boolean) {
		this.manager = manager;

		this.res = res;
		this.width = Math.floor(1024 / this.res / 9);
		this.height = Math.floor(1024 / this.res / 7);

		this.canvas = manager.scene.textures.createCanvas("tileset_" + res + (wall ? "_wall" : "_ground"), 
			this.width * 9 * this.res, this.height * 7 * this.res);
	}

	addTileset(key: string) {
		const x = this.indexes.length % this.width;
		const y = Math.floor(this.indexes.length / this.width);

		this.canvas.drawFrame(key, 0, 9*this.res * x, 7*this.res * y);
		this.indMap[this.manager.currentInd] = this.indexes.length;
		this.indexes.push(this.manager.currentInd++);
	}

	getGlobalIndex(local: number, tileset: number) {
		const lX = local % 9;
		const lY = Math.floor(local / 9);
		const gX = tileset % this.width;
		const gY = Math.floor(tileset / this.width);

		const xx = lX + gX * 9;
		const yy = lY + gY * 9;

		// console.log(lX, lY, this.width);
		return yy * this.width * 9 + xx;
	}
}

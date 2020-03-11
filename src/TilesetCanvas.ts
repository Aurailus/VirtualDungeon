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
		this.width = Math.floor(1024 / (9*this.res));
		this.height = Math.floor(1024 / (7*this.res));

		this.canvas = manager.scene.textures.createCanvas("tileset_" + res + (wall ? "_wall" : "_ground"), 1024, 1024);
	}

	addTileset(key: string) {
		const x = this.indexes.length % this.width;
		const y = Math.floor(this.indexes.length / this.width);

		this.canvas.drawFrame(key, 0, 9*this.res * x, 7*this.res * y);
		this.indMap[this.manager.currentInd] = this.indexes.length;
		this.indexes.push(this.manager.currentInd++);
	}
}

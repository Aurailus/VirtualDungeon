class TilesetCanvas {
	manager: TilesetManager;

	res: number;
	width: number;
	height: number;
	
	canvas: Phaser.Textures.CanvasTexture;

	indexes: number[] = [];
	indMap: number[] = [];

	pad: number = 2;

	constructor(manager: TilesetManager, res: number, wall: boolean) {
		this.manager = manager;

		this.res = res;
		this.width = Math.floor(1024 / ((this.res + this.pad * 2) * 9));
		this.height = Math.floor(1024 / ((this.res + this.pad * 2) * 7));

		this.canvas = manager.scene.textures.createCanvas("tileset_" + res + (wall ? "_wall" : "_ground"), 
			this.width * 9 * (this.res + this.pad * 2) - 2, this.height * 7 * (this.res + this.pad * 2) - 2);
	}

	addTileset(key: string) {
		const x = this.indexes.length % this.width;
		const y = Math.floor(this.indexes.length / this.width);

		this.drawTileset(key, x, y);
		this.indMap[this.manager.currentInd] = this.indexes.length;
		this.indexes.push(this.manager.currentInd++);
	}

	getGlobalIndex(tileset: number, tile: number) {
		const lX = tile % 9;
		const lY = Math.floor(tile / 9);
		const gX = tileset % this.width;
		const gY = Math.floor(tileset / this.width);

		const xx = lX + gX * 9;
		const yy = lY + gY * 9;

		return yy * this.width * 9 + xx;
	}

	private drawTileset(key: string, x: number, y: number) {
		// this.canvas.drawFrame(key, 0, 9*this.res * x, 7*this.res * y);

		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 7; j++) {
				let frame = i + j * 9;


				for (let r = 0; r < 4; r++) {
					let xo = r < 2 ? -this.pad : +this.pad;
					let yo = r % 2 == 0 ? -this.pad : +this.pad;
					this.canvas.drawFrame(key, frame, 
						9 * (this.res + this.pad * 2) * x + i * (this.res + this.pad * 2) + xo, 
						7 * (this.res + this.pad * 2) * y + j * (this.res + this.pad * 2) + yo);
				}

				this.canvas.drawFrame(key, frame, 
					9 * (this.res + this.pad * 2) * x + i * (this.res + this.pad * 2), 
					7 * (this.res + this.pad * 2) * y + j * (this.res + this.pad * 2))
			}
		}

	}
}

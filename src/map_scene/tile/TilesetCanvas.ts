class TilesetCanvas {
	manager: TilesetManager;

	res: number;
	width: number;
	height: number;
	
	canvas: Phaser.Textures.CanvasTexture;

	indexes: number[] = [];
	indMap: number[] = [];

	pad: number = 2;

	constructor(manager: TilesetManager, res: number, layer: Layer) {
		this.manager = manager;

		this.res = res;
		this.width = Math.floor(1024 / ((this.res + this.pad * 2) * 9));
		this.height = Math.floor(1024 / ((this.res + this.pad * 2) * 7));

		this.canvas = manager.scene.textures.createCanvas("tileset_" + res + 
			(layer == Layer.WALL ? "_wall" : layer == Layer.GROUND ? "_ground" : "_overlay"), 
			this.width * 9 * (this.res + this.pad * 2), this.height * 7 * (this.res + this.pad * 2));
	}

	addTileset(key: string, ind: number) {
		const x = this.indexes.length % this.width;
		const y = Math.floor(this.indexes.length / this.width);

		this.drawTileset(key, x, y);
		this.indMap[ind] = this.indexes.length;
		this.indexes.push(ind);
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

		let img: HTMLImageElement = this.manager.scene.textures.get(key).getSourceImage() as HTMLImageElement;
		let refCanvas = document.createElement('canvas');
		refCanvas.width = img.width;
		refCanvas.height = img.height;
		refCanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

		let imageOffX = 9 * (this.res + this.pad * 2) * x;
		let imageOffY = 7 * (this.res + this.pad * 2) * y;

		for (let i = 0; i < 9; i++) {
			for (let j = 0; j < 7; j++) {
				let frame = i + j * 9;

				let tileOffX = imageOffX + i * (this.res + this.pad * 2);
				let tileOffY = imageOffY + j * (this.res + this.pad * 2);

				for (let k = 0; k < this.res + this.pad * 2; k++) {
					for (let l = 0; l < this.pad * 2; l++) {

						let sX = clamp(k - this.pad, 0, this.res - 1);
						let sY = l < this.pad ? 0 : this.res - 1;
						let oY = l < this.pad ? l : l + this.res;

						let pixel = refCanvas.getContext('2d').getImageData(this.res * i + sX, this.res * j + sY, 1, 1).data;
						this.canvas.setPixel(tileOffX + k, tileOffY + oY, pixel[0], pixel[1], pixel[2], pixel[3]);
					}
				}

				for (let k = 0; k < this.pad * 2; k++) {
					for (let l = 0; l < this.res; l++) {

						let sX = k < this.pad ? 0 : this.res - 1;
						let sY = clamp(l, 0, this.res - 1);
						let oX = k < this.pad ? k : k + this.res;

						let pixel = refCanvas.getContext('2d').getImageData(this.res * i + sX, this.res * j + sY, 1, 1).data;
						this.canvas.setPixel(tileOffX + oX, tileOffY + l + this.pad, pixel[0], pixel[1], pixel[2], pixel[3]);
					}
				}
				
				this.canvas.drawFrame(key, frame, 
					9 * (this.res + this.pad * 2) * x + i * (this.res + this.pad * 2) + this.pad, 
					7 * (this.res + this.pad * 2) * y + j * (this.res + this.pad * 2) + this.pad)
			}
		}

		refCanvas.remove();

	}
}

const enum Layer {
	floor = 0,
	wall = 1,
	overlay = 2
}

class MapData {
	scene: MapScene;
	size: Vec2;


	manager: TilesetManager;
	private layers: {[key: number]: { tiles: number[][], tilesets: number[][] }} = {};
	private chunks: MapChunk[][] = [];

	constructor(scene: MapScene, size: Vec2) {
		this.scene = scene;
		this.size = size;
		this.manager = new TilesetManager(scene);

		this.registerLayer(Layer.floor,   () => Math.floor(Math.random() * 6) + 54, 0);
		this.registerLayer(Layer.wall,    0, -1);
		this.registerLayer(Layer.overlay, 0, -1);	

		for (let i = 0; i < Math.ceil(size.y / MapChunk.CHUNK_SIZE); i++) {
			this.chunks[i] = [];
			for (let j = 0; j < Math.ceil(size.x / MapChunk.CHUNK_SIZE); j++) {
				this.chunks[i][j] = new MapChunk(this, j, i);
			}
		}
	}

	update(): void {
		let start = Date.now();
		for (let arr of this.chunks) for (let chunk of arr) {
			chunk.rebuild();
			if (Date.now() - start > 10) break;
		}
	}

	setTile(layer: Layer, tileset: number, xx: number | Vec2, yy?: number): boolean {
		let x: number, y: number;
		if (xx instanceof Vec2) { x = xx.x; y = xx.y; }
		else { x = xx; y = yy; }

		if (x < 0 || y < 0 || x >= this.size.x || y >= this.size.y) return false;

		let oldTileset = this.getTileset(layer, x, y);
		if (oldTileset == tileset) return false;
		this.setTileset(layer, x, y, tileset);
		this.smartTile(x, y);

		return true;
	}

	setTileset(key: number, x: number | Vec2, a?: number, b?: number): void {
		if (x instanceof Vec2) this.layers[key].tilesets[x.y][x.x] = a;
		else this.layers[key].tilesets[a][x] = b;
	}

	getTile(key: number, xx: number | Vec2, yy?: number): number {
		let x: number, y: number;
		if (xx instanceof Vec2) { x = xx.x; y = xx.y; }
		else { x = xx; y = yy; }

		return this.layers[key].tiles[clamp(y, 0, this.size.y - 1)][clamp(x, 0, this.size.x - 1)];
	}

	getTileset(key: number, xx: number | Vec2, yy?: number): number {
		let x: number, y: number;
		if (xx instanceof Vec2) { x = xx.x; y = xx.y; }
		else { x = xx; y = yy; }

		return this.layers[key].tilesets[clamp(y, 0, this.size.y - 1)][clamp(x, 0, this.size.x - 1)];
	}

	private smartTile(x: number, y: number): void {
		for (let i = clamp(x - 1, this.size.x - 1, 0); i <= clamp(x + 1, this.size.x - 1, 0); i++) {
			for (let j = clamp(y - 1, this.size.y - 1, 0); j <= clamp(y + 1, this.size.y - 1, 0); j++) {
				const solids = this.getTilesetsAt(Layer.wall, i, j).map(i => i != -1);

				const wall = SmartTiler.wall(solids, this.getTile(Layer.wall, i, j));
				if (wall != -1) this.setTileRaw(Layer.wall, i, j, wall);

				const floor = SmartTiler.floor(solids, this.getTile(Layer.floor, i, j));
				if (floor != -1) this.setTileRaw(Layer.floor, i, j, floor);

				const overlay = SmartTiler.overlay(this.getTilesetsAt(Layer.overlay, i, j)
					.map(t => t == this.getTileset(Layer.overlay, i, j)), this.getTileset(Layer.overlay, i, j));
				if (overlay != -1) this.setTileRaw(Layer.overlay, i, j, overlay);
			}
		}
	}

	private setTileRaw(key: number, x: number | Vec2, a?: number, b?: number, c?: number): void {
		if (x instanceof Vec2) {
			this.layers[key].tiles[x.y][x.x] = a;
			if (b !== undefined) this.setTileset(key, x, b);

			this.chunks[Math.floor(x.y / MapChunk.CHUNK_SIZE)][Math.floor(x.x / MapChunk.CHUNK_SIZE)]
				.dirty(new Vec2(x.x % MapChunk.CHUNK_SIZE, x.y % MapChunk.CHUNK_SIZE));
		}
		else {
			this.layers[key].tiles[a][x] = b;
			if (c !== undefined) this.setTileset(key, x, a, c);

			this.chunks[Math.floor(a / MapChunk.CHUNK_SIZE)][Math.floor(x / MapChunk.CHUNK_SIZE)]
				.dirty(new Vec2(x % MapChunk.CHUNK_SIZE, a % MapChunk.CHUNK_SIZE));
		}
	}

	private getTilesetsAt(layer: Layer, x: number, y: number): number[] {
		let tilesets: number[] = [];
		for (let i = -1; i <= 1; i++)
			for (let j = -1; j <= 1; j++)
				tilesets.push(this.getTileset(layer, clamp(x + j, 0, this.size.x - 1), clamp(y + i, 0, this.size.y - 1)));
		return tilesets;
	}

	private registerLayer(key: number, startTile: any = 0, startTileset: number = -1): void {
		let layer = {
			tiles: [],
			tilesets: []
		}

		for (let i = 0; i < this.size.y; i++) {
			layer.tiles[i] = [];
			layer.tilesets[i] = [];
			for (let j = 0; j < this.size.x; j++) {
				let tile = typeof(startTile) == "number" ? startTile : startTile();
				layer.tiles[i][j] = tile;
				layer.tilesets[i][j] = startTileset;
			}
		}

		this.layers[key] = layer;
	}
}

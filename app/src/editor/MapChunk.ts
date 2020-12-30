import MapData from './MapData';

import Layer from './util/Layer';
import { Vec2 } from './util/Vec';

export default class MapChunk {
	static CHUNK_SIZE = 16;
	static TILE_SIZE = 16;
	static DIRTY_LIMIT = 32;

	private pos: Vec2;
	private map: MapData;
	private canvas: Phaser.GameObjects.RenderTexture;

	private dirtyList: Vec2[] = [];
	private fullyDirty: boolean = false;

	constructor(map: MapData, x: number, y: number) {
		this.pos = new Vec2(x, y);
		this.canvas = map.scene.add.renderTexture(
			x * MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE * 4, y * MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE * 4,
			MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE, MapChunk.CHUNK_SIZE * MapChunk.TILE_SIZE);

		this.map = map;
		this.canvas.setScale(4);
		this.canvas.setOrigin(0, 0);

		for (let i = 0; i < MapChunk.CHUNK_SIZE * MapChunk.CHUNK_SIZE; i++) {
			let x = i % MapChunk.CHUNK_SIZE;
			let y = Math.floor(i / MapChunk.CHUNK_SIZE);

			let mX = x + this.pos.x * MapChunk.CHUNK_SIZE;
			let mY = y + this.pos.y * MapChunk.CHUNK_SIZE;
			if (mX >= this.map.size.x || mY >= this.map.size.y) continue;

			this.drawTile(x, y);
		}
	}

	dirty(pos: Vec2): void {
		if (!this.fullyDirty) {
			for (let v of this.dirtyList) if (v.equals(pos)) return;
			this.dirtyList.push(pos);

			if (this.dirtyList.length > MapChunk.DIRTY_LIMIT) {
				this.fullyDirty = true;
				this.dirtyList = [];
			}
		}
	}

	rebuild(): boolean {
		if (this.fullyDirty) {
			for (let i = 0; i < MapChunk.CHUNK_SIZE * MapChunk.CHUNK_SIZE; i++) {
				let x = i % MapChunk.CHUNK_SIZE;
				let y = Math.floor(i / MapChunk.CHUNK_SIZE);

				let mX = x + this.pos.x * MapChunk.CHUNK_SIZE;
				let mY = y + this.pos.y * MapChunk.CHUNK_SIZE;
				if (mX >= this.map.size.x || mY >= this.map.size.y) continue;

				this.drawTile(x, y);
			}
			this.fullyDirty = false;
			return true;
		}

		if (this.dirtyList.length === 0) return false;
		
		for (let elem of this.dirtyList) this.drawTile(elem.x, elem.y);
		this.dirtyList = [];
		return true;
	}

	private drawTile(x: number, y: number): void {
		let mX = x + this.pos.x * MapChunk.CHUNK_SIZE;
		let mY = y + this.pos.y * MapChunk.CHUNK_SIZE;

		let wallTile = this.map.getTile(Layer.wall, mX, mY);
		if (this.map.getTileset(Layer.wall, mX, mY) === -1 || (wallTile < 54 || wallTile > 60)) {
			this.canvas.drawFrame(this.map.manager.groundLocations[this.map.getTileset(Layer.floor, mX, mY)].key,
				this.map.getTile(Layer.floor, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
			
			if (this.map.getTileset(Layer.overlay, mX, mY) !== -1)
				this.canvas.drawFrame(this.map.manager.overlayLocations[this.map.getTileset(Layer.overlay, mX, mY)].key,
					this.map.getTile(Layer.overlay, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
		}

		if (this.map.getTileset(Layer.wall, mX, mY) !== -1)
			this.canvas.drawFrame(this.map.manager.wallLocations[this.map.getTileset(Layer.wall, mX, mY)].key,
				this.map.getTile(Layer.wall, mX, mY), x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);

		if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0))
			this.canvas.drawFrame('grid_tile', 0, x * MapChunk.TILE_SIZE, y * MapChunk.TILE_SIZE);
	}
}

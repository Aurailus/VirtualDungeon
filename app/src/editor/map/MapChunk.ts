import * as Phaser from 'phaser';

import MapLayer from './MapLayer';
import TileStore from './TileStore';

import { Vec2 } from '../util/Vec';

export const TILE_SIZE = 16;
export const CHUNK_SIZE = 32;
export const DIRTY_LIMIT = (CHUNK_SIZE * CHUNK_SIZE) / 2;


/**
 * A visual representation of a chunk of a MapLayer.
 */

export default class MapChunk extends Phaser.GameObjects.RenderTexture {
	private dirtyList: Vec2[] = [];
	private fullyDirty: boolean = true;

	constructor(scene: Phaser.Scene, private pos: Vec2, private layer: MapLayer, private tileStore: TileStore) {
		super(scene, CHUNK_SIZE * pos.x - 2 / TILE_SIZE, CHUNK_SIZE * pos.y - 2 / TILE_SIZE,
			CHUNK_SIZE * TILE_SIZE + 4, CHUNK_SIZE * TILE_SIZE + 4);
		this.setScale(1 / TILE_SIZE);
		this.setOrigin(0, 0);

		scene.add.existing(this);
	}


	/**
	 * Indicates that a position on the chunk is dirty so it will be re-rendered.
	 *
	 * @param {Vec2} pos - The position that is dirtied.
	 */

	setDirty(pos: Vec2): void {
		if (!this.fullyDirty) {
			for (let v of this.dirtyList) if (v.equals(pos)) return;
			this.dirtyList.push(pos);

			if (this.dirtyList.length > DIRTY_LIMIT) {
				this.fullyDirty = true;
				this.dirtyList = [];
			}
		}
	}


	/**
	 * Redraws all dirty tiles on the chunk.
	 *
	 * @returns {boolean} - A boolean indicating if tiles have changed since the last render.
	 */

	redraw(): boolean {
		// if (!this.willRender()) return false;

		if (this.fullyDirty) {
			for (let i = 0; i < CHUNK_SIZE * CHUNK_SIZE; i++) {
				let x = i % CHUNK_SIZE;
				let y = Math.floor(i / CHUNK_SIZE);

				if (x + this.pos.x * CHUNK_SIZE >= this.layer.size.x ||
						y + this.pos.y * CHUNK_SIZE >= this.layer.size.y) continue;

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


	/**
	 * Redraws the tile at the specified position,
	 * based on the current data on the MapLayer.
	 *
	 * @param {number} x - The x position to draw at.
	 * @param {number} y - The y position to draw at.
	 */

	private drawTile(x: number, y: number): void {
		let mX = x + this.pos.x * CHUNK_SIZE;
		let mY = y + this.pos.y * CHUNK_SIZE;

		let wallTile = this.layer.getTile('wall', mX, mY);
		let wallTileIndex = this.layer.getTileIndex('wall', mX, mY);

		let floorTile = this.layer.getTile('floor', mX, mY);
		let floorTileIndex = this.layer.getTileIndex('floor', mX, mY);

		let detailTile = this.layer.getTile('detail', mX, mY);
		let detailTileIndex = this.layer.getTileIndex('detail', mX, mY);

		if (floorTile > 0)
			this.drawFrame(this.tileStore.floorTiles[floorTile].identifier, floorTileIndex, x * TILE_SIZE + 2, y * TILE_SIZE + 2);
		else {
			this.erase('erase_tile', x * TILE_SIZE + 2, y * TILE_SIZE + 2);
			if (wallTile === 0 && detailTile === 0) return;
		}

		if (detailTile > 0)
			this.drawFrame(this.tileStore.detailTiles[detailTile].identifier, detailTileIndex, x * TILE_SIZE + 2, y * TILE_SIZE + 2);

		if (wallTile > 0)
			this.drawFrame(this.tileStore.wallTiles[wallTile].identifier, wallTileIndex, x * TILE_SIZE + 2, y * TILE_SIZE + 2);
		
		if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0))
			this.drawFrame('grid_tile', 0, x * TILE_SIZE + 2, y * TILE_SIZE + 2);
	}
}

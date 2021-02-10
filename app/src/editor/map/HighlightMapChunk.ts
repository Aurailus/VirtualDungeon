import * as Phaser from 'phaser';

import MapLayer from './MapLayer';

import { Vec2 } from '../util/Vec';

export const TILE_SIZE = 16;
export const CHUNK_SIZE = 32;
export const DIRTY_LIMIT = (CHUNK_SIZE * CHUNK_SIZE) / 2;


/**
 * A highlight / checkerboard map overlay.
 */

export default class HighlightMapChunk extends Phaser.GameObjects.RenderTexture {
	private dirtyList: Vec2[] = [];
	private fullyDirty: boolean = true;
	private tile: Phaser.GameObjects.Sprite;

	constructor(scene: Phaser.Scene, private pos: Vec2, readonly layer: MapLayer) {
		super(scene, CHUNK_SIZE * pos.x - 2 / TILE_SIZE, CHUNK_SIZE * pos.y - 2 / TILE_SIZE,
			CHUNK_SIZE * TILE_SIZE + 4, CHUNK_SIZE * TILE_SIZE + 4);
		this.setScale(1 / TILE_SIZE);
		this.setOrigin(0, 0);

		this.tile = new Phaser.GameObjects.Sprite(this.scene, 0, 0, '');
		this.tile.setVisible(false);
		this.tile.setOrigin(0);

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
		// const time = Date.now();

		this.tile.setVisible(true);
		if (this.fullyDirty) {
			for (let i = 0; i < CHUNK_SIZE * CHUNK_SIZE; i++) {
				let x = i % CHUNK_SIZE;
				let y = Math.floor(i / CHUNK_SIZE);

				if (x + this.pos.x * CHUNK_SIZE >= this.layer.size.x ||
						y + this.pos.y * CHUNK_SIZE >= this.layer.size.y) continue;

				this.drawTile(x, y);
			}

			this.fullyDirty = false;
			// console.log('MapChunk took', (Date.now() - time), 'ms');
			return true;
		}

		if (this.dirtyList.length === 0) return false;
		
		for (let elem of this.dirtyList) this.drawTile(elem.x, elem.y);
		this.dirtyList = [];

		// console.log('MapChunk took', (Date.now() - time), 'ms');
		this.tile.setVisible(false);
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
		const pos = new Vec2(x + this.pos.x * CHUNK_SIZE, y + this.pos.y * CHUNK_SIZE);

		let highlightTint = this.layer.getTile('wall', pos);
		let highlightIndex = this.layer.getTileIndex('wall', pos);

		this.erase('erase_tile', x * TILE_SIZE + 2, y * TILE_SIZE + 2);
		if (highlightTint > 0) {
			this.tile.setPosition(x * TILE_SIZE + 2, y * TILE_SIZE + 2);
			this.tile.setTexture('user_highlight', highlightIndex);
			this.tile.setTint(highlightTint);
			this.draw(this.tile);
		}

		if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0))
			this.drawFrame('grid_tile', 0, x * TILE_SIZE + 2, y * TILE_SIZE + 2);
	}
}

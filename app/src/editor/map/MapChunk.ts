import * as Phaser from 'phaser';

import MapLayer from './MapLayer';
import TileStore from './TileStore';

import { Vec2 } from '../util/Vec';
import { Layer } from '../util/Layer';

export const TILE_SIZE = 16;
export const CHUNK_SIZE = 32;
export const DIRTY_LIMIT = (CHUNK_SIZE * CHUNK_SIZE) / 3;

const ORDER: Layer[] = [ 'floor', 'detail', 'wall' ];


/**
 * Creates a canvas for a MapChunk.
 */

function createCanvas(textures: Phaser.Textures.TextureManager): Phaser.Textures.CanvasTexture {
	const size = new Vec2(CHUNK_SIZE * TILE_SIZE + 4, CHUNK_SIZE * TILE_SIZE + 4);
	const canvas = document.createElement('canvas');
	canvas.width = size.x;
	canvas.height = size.y;
	return textures.addCanvas('', canvas, true);
}


/**
 * A visual chunk of a MapLayer.
 */

export default class MapChunk extends Phaser.GameObjects.Image {
	protected chunk: Phaser.Textures.CanvasTexture;
	protected chunkCtx: CanvasRenderingContext2D;
	protected tmp: HTMLCanvasElement;
	protected tmpCtx: CanvasRenderingContext2D;;

	private dirtyList: Vec2[] = [];
	private fullyDirty: boolean = true;

	constructor(scene: Phaser.Scene, protected pos: Vec2, readonly layer: MapLayer, private tileStore: TileStore) {
		super(scene, CHUNK_SIZE * pos.x - 2 / TILE_SIZE, CHUNK_SIZE * pos.y - 2 / TILE_SIZE, createCanvas(scene.textures));
		this.scene.add.existing(this);
		this.setScale(1 / TILE_SIZE);
		this.setOrigin(0, 0);

		this.chunk = (this.texture as Phaser.Textures.CanvasTexture);
		this.chunkCtx = this.chunk.getContext();

		this.tmp = document.createElement('canvas');
		this.tmpCtx = this.tmp.getContext('2d')!;
		this.tmp.width = TILE_SIZE;
		this.tmp.height = TILE_SIZE;

		this.updateDepth();
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
	 * Sets whether or not the chunk should render as a shadow.
	 */

	setShadow(shadow: boolean) {
		this.setTint(shadow ? 0x000000 : 0xffffff);
		this.setAlpha(shadow ? .2 : 1);
	}


	/**
	 * Updates the depth of the chunk based on the layer's index.
	 */

	updateDepth() {
		this.setDepth(-1000 + this.layer.index * 25);
	}


	/**
	 * Redraws all dirty tiles on the chunk.
	 *
	 * @returns {boolean} - A boolean indicating if tiles have changed since the last render.
	 */

	redraw(): boolean {
		if (this.dirtyList.length === 0 && !this.fullyDirty) return false;
		
		// const time = Date.now();

		if (this.fullyDirty) {
			this.fullyDirty = false;
			for (let i = 0; i < CHUNK_SIZE * CHUNK_SIZE; i++) {
				let x = i % CHUNK_SIZE;
				let y = Math.floor(i / CHUNK_SIZE);
				if (x + this.pos.x * CHUNK_SIZE >= this.layer.size.x ||
						y + this.pos.y * CHUNK_SIZE >= this.layer.size.y) continue;
				this.drawTile(x, y);
			}
		}
		else {
			for (let elem of this.dirtyList) this.drawTile(elem.x, elem.y);
			this.dirtyList = [];
		}

		this.chunk.refresh();
		// console.log('MapChunk took', (Date.now() - time), 'ms');
		return true;
	}


	/**
	 * Redraws the tile at the specified position,
	 * based on the current data on the MapLayer.
	 *
	 * @param {number} x - The x position to draw at.
	 * @param {number} y - The y position to draw at.
	 */

	protected drawTile(x: number, y: number): void {
		const pos = new Vec2(x + this.pos.x * CHUNK_SIZE, y + this.pos.y * CHUNK_SIZE);

		for (let i = 0; i < ORDER.length; i++) {
			const l = ORDER[i];

			let tile = this.layer.getTile(l, pos);
			let index = this.layer.getTileIndex(l, pos);

			if (tile > 0) {
				// The amount of columns in the tile patch image. 9 for floors, 10 for walls & details.
				const W = i === 0 ? 9 : 10;

				const inf = this.tileStore.getTile(l, tile);
				if (!inf) {
					// console.error('Tile not found!', tile);
					continue;
				}
				const tex = this.scene.textures.get(inf.identifier);
				const ctx = (tex as Phaser.Textures.CanvasTexture).getContext();
					
				const data = ctx.getImageData((index % W) * TILE_SIZE, Math.floor(index / W) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
				if (i === 0) {
					// Don't need to use the temporary canvas for floors, as they should completely overwrite the pixels blow.
					this.chunkCtx.putImageData(data, x * TILE_SIZE + 2, y * TILE_SIZE + 2);
				}
				else {
					this.tmpCtx.putImageData(data, 0, 0);
					this.chunkCtx.drawImage(this.tmp, x * TILE_SIZE + 2, y * TILE_SIZE + 2);
				}
			}
			else if (i === 0) {
				// Clear away the previous texture if no ground exists.
				this.chunkCtx.clearRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE, TILE_SIZE);
			}
		}
	}
}

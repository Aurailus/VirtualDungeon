import MapLayer from './MapLayer';
import TileStore from './TileStore';
import MapChunk, { TILE_SIZE, CHUNK_SIZE } from './MapChunk';

import { Vec2 } from '../util/Vec';
import * as Color from '../../../../common/Color';

/**
 * A highlight / checkerboard map overlay.
 */

export default class HighlightMapChunk extends MapChunk {
	constructor(scene: Phaser.Scene, pos: Vec2, layer: MapLayer, tileStore: TileStore) {
		super(scene, pos, layer, tileStore);
	}


	/**
	 * Updates the depth of the chunk based on the layer's index.
	 */

	updateDepth() {
		this.setDepth(10000);
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

		let tint = this.layer.getTile('wall', pos);
		let index = this.layer.getTileIndex('wall', pos);

		this.chunkCtx.clearRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, TILE_SIZE, TILE_SIZE);
		if (tint > 0) {
			const user_ctx = (this.scene.textures.get('user_highlight') as Phaser.Textures.CanvasTexture).getContext();
			const data = user_ctx.getImageData((index % 10) * TILE_SIZE, Math.floor(index / 10) * TILE_SIZE, TILE_SIZE, TILE_SIZE);
			
			this.tmpCtx.putImageData(data, 0, 0);
			this.tmpCtx.globalCompositeOperation = 'source-in';
			this.tmpCtx.fillStyle = Color.intToHex(tint);
			this.tmpCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
			this.tmpCtx.globalCompositeOperation = 'source-over';

			this.chunkCtx.drawImage(this.tmp, x * TILE_SIZE + 2, y * TILE_SIZE + 2);
		}
		
		const grid_image = (this.scene.textures.get('grid_tile').source[0].image);
		if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0))
			this.chunkCtx.drawImage(grid_image, x * TILE_SIZE + 2, y * TILE_SIZE + 2);
	}
}

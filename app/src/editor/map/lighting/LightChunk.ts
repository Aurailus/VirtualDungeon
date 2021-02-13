import * as Phaser from 'phaser';

import type LightSource from './LightSource';

import { Vec2 } from '../../util/Vec';

export const CHUNK_TILE_SIZE = 32;
export const CHUNK_RESOLUTION = 16;


/**
 * Creates a canvas for a LightChunk.
 */

function createCanvas(textures: Phaser.Textures.TextureManager): Phaser.Textures.CanvasTexture {
	const size = new Vec2(CHUNK_TILE_SIZE * CHUNK_RESOLUTION + 2, CHUNK_TILE_SIZE * CHUNK_RESOLUTION + 2);
	const canvas = document.createElement('canvas');
	canvas.width = size.x;
	canvas.height = size.y;
	return textures.addCanvas('', canvas, true);
}

export default class LightChunk extends Phaser.GameObjects.Image {
	private canvas: Phaser.Textures.CanvasTexture;
	private context: CanvasRenderingContext2D;

	constructor(scene: Phaser.Scene, public pos: Vec2) {
		super(scene, pos.x * CHUNK_TILE_SIZE - 1 / CHUNK_RESOLUTION,
			pos.y * CHUNK_TILE_SIZE - 1 / CHUNK_RESOLUTION, createCanvas(scene.textures));
		
		this.canvas = (this.texture as Phaser.Textures.CanvasTexture);
		this.context = this.canvas.getContext();

		this.setScale(1 / CHUNK_RESOLUTION);
		this.setOrigin(0);
		this.setAlpha(0.6);
	}

	applySources(sources: LightSource[]) {
		// const t = Date.now();

		// this.context.fillStyle = '#001133';
		this.context.fillStyle = '#003311';
		// this.context.fillStyle = '#332211';
		this.context.fillRect(1, 1, this.canvas.width, this.canvas.height);

		this.context.globalCompositeOperation = 'destination-out';
		for (let source of sources) {
			let lp = new Vec2(source.pos.x - this.pos.x * CHUNK_TILE_SIZE, source.pos.y - this.pos.y * CHUNK_TILE_SIZE);
			if ((lp.x + source.radius > 0 || lp.x - source.radius < CHUNK_TILE_SIZE) &&
				(lp.y + source.radius > 0 || lp.y - source.radius < CHUNK_TILE_SIZE)) {
				this.context.drawImage(source.getCanvas(),
					(lp.x - source.radius + 0.5) * CHUNK_RESOLUTION + 1,
					(lp.y - source.radius + 0.5) * CHUNK_RESOLUTION + 1);
			}
		}

		this.context.globalCompositeOperation = 'source-over';
		this.context.clearRect(0, 0, this.canvas.width, 1);
		this.context.clearRect(0, this.canvas.height - 1, this.canvas.width, this.canvas.height);
		this.context.clearRect(0, 0, 1, this.canvas.height);
		this.context.clearRect(this.canvas.width - 1, 0, this.canvas.width, this.canvas.height);
		
		this.canvas.refresh();

		// console.log(Date.now() - t);
	}
}

import * as Phaser from 'phaser';

import type LightSource from './LightSource';

import { Vec2 } from '../../util/Vec';

export const CHUNK_SIZE = 512;

export default class LightChunk extends Phaser.GameObjects.RenderTexture {
	pos: Vec2;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x * CHUNK_SIZE, y * CHUNK_SIZE, CHUNK_SIZE);
		
		this.pos = new Vec2(x, y);
		
		this.setScale(4);
		this.setOrigin(0, 0);
		this.setAlpha(0);

		this.build([]);
	}

	build(sourceGfx: {src: LightSource; gfx: Phaser.GameObjects.RenderTexture}[]) {
		
		// Reset
		
		const reset = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, CHUNK_SIZE, CHUNK_SIZE, 0x000000);
		reset.setDisplayOrigin(0, 0);
		reset.setOrigin(0, 0);
		this.draw(reset);
		reset.destroy();

		// Draw Sources

		for (let source of sourceGfx) {
			let lp = new Vec2(source.src.x - this.pos.x * CHUNK_SIZE, source.src.y - this.pos.y * CHUNK_SIZE);
			if ((lp.x + source.src.radius > 0 || lp.x - source.src.radius < CHUNK_SIZE) &&
				(lp.y + source.src.radius > 0 || lp.y - source.src.radius < CHUNK_SIZE)) {
				
				source.gfx.setPosition(lp.x - source.src.radius, lp.y - source.src.radius);
				this.draw(source.gfx);
			}
		}
	}
}

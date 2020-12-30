import type Lighting from './Lighting';
import type LightSource from './LightSource';

import { Vec2 } from '../util/Vec';

export default class LightChunk {
	static CHUNK_SIZE = 512;

	pos: Vec2;

	private light: Lighting;
	private canvas: Phaser.GameObjects.RenderTexture;

	constructor(light: Lighting, x: number, y: number) {
		this.pos = new Vec2(x, y);
		this.canvas = light.scene.add.renderTexture(
			x * LightChunk.CHUNK_SIZE * 4, y * LightChunk.CHUNK_SIZE * 4, LightChunk.CHUNK_SIZE, LightChunk.CHUNK_SIZE);

		this.light = light;
		this.canvas.setScale(4);
		this.canvas.setOrigin(0, 0);
		this.canvas.setAlpha(0.4);

		this.build([]);
	}

	build(sourceGfx: {src: LightSource; gfx: Phaser.GameObjects.RenderTexture}[]) {
		// Reset
		const reset = new Phaser.GameObjects.Rectangle(this.light.scene, 0, 0, LightChunk.CHUNK_SIZE, LightChunk.CHUNK_SIZE, 0x000000);
		reset.setDisplayOrigin(0, 0);
		reset.setOrigin(0, 0);
		this.canvas.draw(reset);
		reset.destroy();

		// Draw Sources
		for (let source of sourceGfx) {
			let lp = new Vec2(source.src.x - this.pos.x * LightChunk.CHUNK_SIZE, source.src.y - this.pos.y * LightChunk.CHUNK_SIZE);
			if ((lp.x + source.src.radius > 0 || lp.x - source.src.radius < LightChunk.CHUNK_SIZE) &&
				(lp.y + source.src.radius > 0 || lp.y - source.src.radius < LightChunk.CHUNK_SIZE)) {
				
				source.gfx.setPosition(lp.x - source.src.radius, lp.y - source.src.radius);
				this.canvas.draw(source.gfx);
			}
		}
	}
}

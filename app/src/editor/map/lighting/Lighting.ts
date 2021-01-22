import * as Phaser from 'phaser';

import Map from '../Map';
import LightSource from './LightSource';
import { CHUNK_SIZE as MAP_CHUNK_SIZE } from '../MapChunk';
import LightChunk, { CHUNK_SIZE as LIGHT_CHUNK_SIZE } from './LightChunk';

import { clamp } from '../../util/Helpers';
import { Vec2, Vec4 } from '../../util/Vec';

export default class Lighting {
	private map: Map | null = null;
	private scene: Phaser.Scene | null = null;

	private chunks: LightChunk[][] = [];
	private sources: LightSource[] = [];
	private dirtyChunks: Set<LightChunk> = new Set();

	init(scene: Phaser.Scene, map: Map) {
		this.scene = scene;
		this.map = map;

		for (let i = 0; i < Math.ceil(map.size.y / (MAP_CHUNK_SIZE * 2)); i++) {
			this.chunks[i] = [];
			for (let j = 0; j < Math.ceil(map.size.x / (MAP_CHUNK_SIZE * 2)); j++) {
				this.chunks[i][j] = new LightChunk(scene, j, i);
			}
		}

		for (let i = 0; i < 5; i++) {
			let x = Math.floor(Math.random() * 300) * 16;
			let y = Math.floor(Math.random() * 300) * 16;
			this.addLightSource(x, y, 12*16, 1);
		}
	}

	update() {
		if (this.dirtyChunks.size > 0) {
			let sources: Set<LightSource> = new Set();

			for (let chunk of this.dirtyChunks) {
				let chunkBounds = new Vec4(chunk.pos.x * LIGHT_CHUNK_SIZE, chunk.pos.y * LIGHT_CHUNK_SIZE,
					(chunk.pos.x + 1) * LIGHT_CHUNK_SIZE, (chunk.pos.y + 1) * LIGHT_CHUNK_SIZE);
				
				for (let source of this.sources) {
					let sourceBounds = new Vec4(source.x - source.radius, source.y - source.radius,
						source.x + source.radius, source.y + source.radius);
					if (chunkBounds.z >= sourceBounds.x && chunkBounds.x <= sourceBounds.z &&
						chunkBounds.y <= sourceBounds.w && chunkBounds.w >= sourceBounds.y) sources.add(source);
				}
			}

			let sourceGfx = Array.from(sources).map((src) => ({ src: src, gfx: src.createGfx() }));
			for (let chunk of this.dirtyChunks) chunk.build(sourceGfx);
			sourceGfx.forEach((s) => s.gfx.destroy());
			this.dirtyChunks.clear();
		}
	}

	tileUpdatedAt(x: number, y: number) {
		for (let source of this.sources) {
			if ((x * 16 >= source.x - source.radius && x * 16 <= source.x + source.radius) &&
				  (y * 16 >= source.y - source.radius && y * 16 <= source.y + source.radius)) {
				
				const minChunkPos = new Vec2(clamp(Math.floor((source.x - source.radius) / LIGHT_CHUNK_SIZE), 0, this.chunks[0].length - 1),
					clamp(Math.floor((source.y - source.radius) / LIGHT_CHUNK_SIZE), 0, this.chunks.length - 1));
				const maxChunkPos = new Vec2(clamp(Math.ceil((source.x + source.radius) / LIGHT_CHUNK_SIZE), 0, this.chunks[0].length - 1),
					clamp(Math.ceil((source.y + source.radius) / LIGHT_CHUNK_SIZE), 0, this.chunks.length - 1));
				
				for (let i = minChunkPos.x; i <= maxChunkPos.x; i++) {
					for (let j = minChunkPos.y; j <= maxChunkPos.y; j++) {
						this.dirtyChunks.add(this.chunks[j][i]);
					}
				}
			}
		}
	}

	addLightSource(x: number, y: number, radius?: number, intensity?: number ) {
		let s = new LightSource(this.scene!, this.map!, x, y);
		if (radius !== undefined) s.setRadius(radius);
		if (intensity !== undefined) s.setIntensity(intensity);
		this.sources.push(s);

		const minChunkPos = new Vec2(clamp(Math.floor((s.x - s.radius) / LIGHT_CHUNK_SIZE), 0, this.chunks[0].length - 1),
			clamp(Math.floor((s.y - s.radius) / LIGHT_CHUNK_SIZE), 0, this.chunks.length - 1));
		const maxChunkPos = new Vec2(clamp(Math.ceil((s.x + s.radius) / LIGHT_CHUNK_SIZE), 0, this.chunks[0].length - 1),
			clamp(Math.ceil((s.y + s.radius) / LIGHT_CHUNK_SIZE), 0, this.chunks.length - 1));
		
		for (let i = minChunkPos.x; i <= maxChunkPos.x; i++) {
			for (let j = minChunkPos.y; j <= maxChunkPos.y; j++) {
				this.dirtyChunks.add(this.chunks[j][i]);
			}
		}
	}
}

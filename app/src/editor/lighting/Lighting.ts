import { CHUNK_SIZE } from '../map/MapChunk';
import type MapScene from '../scene/MapScene';

import LightChunk from './LightChunk';
import LightSource from './LightSource';

import { clamp } from '../util/Helpers';
import { Vec2, Vec4 } from '../util/Vec';

export default class Lighting {
	scene: MapScene;
	size: Vec2 = new Vec2();

	private chunks: LightChunk[][] = [];

	private sources: LightSource[] = [];
	private dirtyChunks: Set<LightChunk> = new Set();

	constructor(scene: MapScene) {
		this.scene = scene;
	}

	init(size: Vec2) {
		this.size = size;

		for (let i = 0; i < Math.ceil(size.y / (CHUNK_SIZE * 2)); i++) {
			this.chunks[i] = [];
			for (let j = 0; j < Math.ceil(size.x / (CHUNK_SIZE * 2)); j++) {
				this.chunks[i][j] = new LightChunk(this, j, i);
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
				let chunkBounds = new Vec4(chunk.pos.x * LightChunk.CHUNK_SIZE, chunk.pos.y * LightChunk.CHUNK_SIZE,
					(chunk.pos.x + 1) * LightChunk.CHUNK_SIZE, (chunk.pos.y + 1) * LightChunk.CHUNK_SIZE);
				
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
				
				const minChunkPos = new Vec2(clamp(Math.floor((source.x - source.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1),
					clamp(Math.floor((source.y - source.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
				const maxChunkPos = new Vec2(clamp(Math.ceil((source.x + source.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1),
					clamp(Math.ceil((source.y + source.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
				
				for (let i = minChunkPos.x; i <= maxChunkPos.x; i++) {
					for (let j = minChunkPos.y; j <= maxChunkPos.y; j++) {
						this.dirtyChunks.add(this.chunks[j][i]);
					}
				}
			}
		}
	}

	addLightSource(x: number, y: number, radius?: number, intensity?: number ) {
		let s = new LightSource(this, x, y);
		if (radius !== undefined) s.setRadius(radius);
		if (intensity !== undefined) s.setIntensity(intensity);
		this.sources.push(s);

		const minChunkPos = new Vec2(clamp(Math.floor((s.x - s.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1),
			clamp(Math.floor((s.y - s.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
		const maxChunkPos = new Vec2(clamp(Math.ceil((s.x + s.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1),
			clamp(Math.ceil((s.y + s.radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
		
		for (let i = minChunkPos.x; i <= maxChunkPos.x; i++) {
			for (let j = minChunkPos.y; j <= maxChunkPos.y; j++) {
				this.dirtyChunks.add(this.chunks[j][i]);
			}
		}
	}
}

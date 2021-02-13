import * as Phaser from 'phaser';

import Map from '../Map';
import LightSource from './LightSource';
import LightChunk, { CHUNK_TILE_SIZE } from './LightChunk';

import { clamp } from '../../util/Helpers';
import { Vec2 } from '../../util/Vec';

export default class Lighting {
	private map: Map = null as any;
	private scene: Phaser.Scene = null as any;

	private chunks: LightChunk[][] = [];
	private sources: LightSource[] = [];
	private dirtySources: Set<LightSource> = new Set();
	private dirtyChunks: Set<LightChunk> = new Set();

	init(scene: Phaser.Scene, map: Map) {
		this.scene = scene;
		this.map = map;

		setTimeout(() => {
			for (let i = 0; i < Math.ceil(map.size.y / CHUNK_TILE_SIZE); i++) {
				this.chunks[i] = [];
				for (let j = 0; j < Math.ceil(map.size.x / CHUNK_TILE_SIZE); j++) {
					const chunk = new LightChunk(scene, new Vec2(j, i));
					this.chunks[i][j] = chunk;
					this.scene.add.existing(chunk);
				}
			}

			for (let i = 0; i < 30; i++) {
				const pos = new Vec2(Math.floor(Math.random() * 64), Math.floor(Math.random() * 64));
				this.addLight(pos, Math.random() * 7 + 5, Math.random() + 0.3);
			}

			this.chunks.forEach(cA => cA.forEach(c => c.applySources(this.sources)));
		});
	}

	update() {
		this.dirtySources.forEach(s => s.rebuildCanvas());
		this.dirtyChunks.forEach(c => c.applySources(this.sources));
		this.dirtySources.clear();
		this.dirtyChunks.clear();
	}

	tileUpdatedAt(x: number, y: number) {
		for (let s of this.sources) {
			if ((x >= s.pos.x - s.radius && x <= s.pos.x + s.radius) &&
				  (y >= s.pos.y - s.radius && y <= s.pos.y + s.radius)) {
				this.dirtySources.add(s);

				const minChunkPos = new Vec2(clamp(Math.floor((s.pos.x - s.radius) / CHUNK_TILE_SIZE), 0, this.chunks[0].length - 1),
					clamp(Math.floor((s.pos.y - s.radius) / CHUNK_TILE_SIZE), 0, this.chunks.length - 1));
				const maxChunkPos = new Vec2(clamp(Math.ceil((s.pos.x + s.radius) / CHUNK_TILE_SIZE), 0, this.chunks[0].length - 1),
					clamp(Math.ceil((s.pos.y + s.radius) / CHUNK_TILE_SIZE), 0, this.chunks.length - 1));
				
				for (let i = minChunkPos.x; i <= maxChunkPos.x; i++) {
					for (let j = minChunkPos.y; j <= maxChunkPos.y; j++) {
						this.dirtyChunks.add(this.chunks[j][i]);
					}
				}
			}
		}
	}

	addLight(pos: Vec2, radius?: number, intensity?: number ) {
		const s = new LightSource(this.scene, this.map, pos, radius ?? 5, intensity ?? 1);
		this.sources.push(s);

		const minChunkPos = new Vec2(clamp(Math.floor((s.pos.x - s.radius) / CHUNK_TILE_SIZE), 0, this.chunks[0].length - 1),
			clamp(Math.floor((s.pos.y - s.radius) / CHUNK_TILE_SIZE), 0, this.chunks.length - 1));
		const maxChunkPos = new Vec2(clamp(Math.ceil((s.pos.x + s.radius) / CHUNK_TILE_SIZE), 0, this.chunks[0].length - 1),
			clamp(Math.ceil((s.pos.y + s.radius) / CHUNK_TILE_SIZE), 0, this.chunks.length - 1));
		
		for (let i = minChunkPos.x; i <= maxChunkPos.x; i++)
			for (let j = minChunkPos.y; j <= maxChunkPos.y; j++)
				this.dirtyChunks.add(this.chunks[j][i]);
	}
}

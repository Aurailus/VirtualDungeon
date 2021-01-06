import * as Phaser from 'phaser';

import MapLayer from './MapLayer';
import TileStore from './TileStore';
import MapChunk, { CHUNK_SIZE } from './MapChunk';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';



export default class MapData {
	tileStore: TileStore = new TileStore();
	size: Vec2 = new Vec2(0, 0);
	
	activeLayer: MapLayer = {} as MapLayer;
	private layers: MapLayer[] = [];

	private chunks: MapChunk[][] = [];

	init(scene: Phaser.Scene, size: Vec2, assets: Asset[]) {
		this.size = size;
		this.tileStore.init(scene.textures, assets);

		this.layers.push(new MapLayer(size, this.handleDirty));
		this.activeLayer = this.layers[0];

		for (let i = 0; i < Math.ceil(size.y / CHUNK_SIZE); i++) {
			this.chunks[i] = [];
			for (let j = 0; j < Math.ceil(size.x / CHUNK_SIZE); j++) {
				this.chunks[i][j] = new MapChunk(scene, new Vec2(j, i), this.activeLayer, this.tileStore);
			}
		}
	}

	update(): void {
		let start = Date.now();
	
		for (let arr of this.chunks) {
			for (let chunk of arr) {
				chunk.redraw();
				if (Date.now() - start > 10) break;
			}
		}

		// if (this.scene.i.keyPressed('S')) this.saveMap();
		// if (this.scene.i.keyPressed('L')) this.loadMap(this.savedMapData);
	}

	private handleDirty = (x: number, y: number) => {
		this.chunks[Math.floor(y / CHUNK_SIZE)][Math.floor(x / CHUNK_SIZE)].setDirty(new Vec2(x % CHUNK_SIZE, y % CHUNK_SIZE));
	};

	// private saveMap() {

	// 	let mapData: number[][] = [];

	// 	for (let k = 0; k < 3; k++) {
	// 		let tile = 0;
	// 		let count = 0;
	// 		mapData[k] = [];

	// 		for (let i = 0; i < this.size.x * this.size.y; i++) {
	// 			let x = i % this.size.x;
	// 			let y = Math.floor(i / this.size.x);

	// 			if (this.getTileset(k, x, y) === tile) count++;
	// 			else {
	// 				if (i !== 0) {
	// 					mapData[k].push(tile);
	// 					mapData[k].push(count);
	// 				}
	// 				tile = this.getTileset(k, x, y);
	// 				count = 1;
	// 			}
	// 		}
	// 	}

	// 	this.savedMapData = mapData;
	// }

	// private loadMap(dat: number[][]) {
	// 	for (let k = 0; k < 3; k++) {
	// 		let offset = 0;
	// 		for (let i = 0; i < dat[k].length / 2; i++) {
	// 			let tile = dat[k][i * 2];
	// 			let count = dat[k][i * 2 + 1];

	// 			for (let t = 0; t < count; t++) {
	// 				let x = (offset + t) % this.size.x;
	// 				let y = Math.floor((offset + t) / this.size.x);

	// 				this.setTile(k, tile, x, y);
	// 			}
	// 			offset += count;
	// 		}
	// 	}
	// }
}

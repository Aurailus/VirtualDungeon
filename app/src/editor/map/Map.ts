import * as Phaser from 'phaser';

import Token from '../Token';
import MapLayer from './MapLayer';
import TileStore from './TileStore';
import * as MapSaver from './MapSaver';
import MapChunk, { CHUNK_SIZE } from './MapChunk';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';


/**
 * Main map controller that manages the map data and chunks.
 */

export default class Map {
	size: Vec2 = new Vec2(0, 0);
	tileStore: TileStore = new TileStore();
	activeLayer?: MapLayer = {} as MapLayer;

	tokens: Token[] = [];
	
	private layers: MapLayer[] = [];
	private chunks: MapChunk[][][] = [];

	private scene: Phaser.Scene = undefined as any;

	init(scene: Phaser.Scene, size: Vec2, assets: Asset[]) {
		this.scene = scene;
		this.size = size;
		this.tileStore.init(scene.textures, assets);
	}


	/**
	 * Rerenders dirty MapChunks.
	 */

	update(): void {
		let start = Date.now();

		for (let layer of this.chunks) {
			for (let chunkRow of layer) {
				for (let chunk of chunkRow) {
					if (Date.now() - start > 4) return;
					chunk.redraw();
				}
			}
		}
	}


	/**
	 * Gets the array of map layers.
	 */

	getLayers(): MapLayer[] {
		return this.layers;
	}


	/**
	 * Gets a map layer based on its index.
	 */

	getLayer(layer: number): MapLayer | undefined {
		return this.layers[layer];
	}


	/**
	 * Creates a new map layer at the specified index.
	 * If no index is specified, the layer will be added at the top of the stack.
	 *
	 * @param {number} index - the index that the layer should be added at.
	 */

 	addLayer(): MapLayer {
		const layer = new MapLayer(this.layers.length, this.size);
		layer.init(this.handleDirty.bind(this, layer.index));

		this.layers.push(layer);
		this.activeLayer = layer;
		this.createMapChunks(this.scene);

		return layer;
 	}


	/**
	 * Returns a serialized map string representing the map.
	 *
	 * @returns {string} - a serialized map string.
	 */

	save(): string {
		return MapSaver.save(this.size, this.layers);
	}


	/**
	 * Loads a serialized map string into this map.
	 *
	 * @param {string} mapData - the serialized map.
	 */

	load(mapData: string) {
		const data = MapSaver.load(mapData);
		this.size = data.size;

		this.layers = data.layers;
		this.layers.forEach(l => l.init(this.handleDirty.bind(this, l.index)));
		this.activeLayer = this.layers[0];

		this.createMapChunks(this.scene);
	}


	/**
	 * Creates a visual representation of the map.
	 *
	 * @param {Phaser.Scene} scene - The scene to add the chunks to.
	 */

	private createMapChunks(scene: Phaser.Scene) {
		this.chunks.forEach(cA => cA.forEach(cS => cS.forEach(c => c.destroy())));
		this.chunks = [];

		for (const layer of this.layers) {
			this.chunks[layer.index] = [];
			for (let i = 0; i < Math.ceil(this.size.y / CHUNK_SIZE); i++) {
				this.chunks[layer.index][i] = [];
				for (let j = 0; j < Math.ceil(this.size.x / CHUNK_SIZE); j++) {
					this.chunks[layer.index][i][j] = new MapChunk(scene, new Vec2(j, i), layer, this.tileStore);
				}
			}
		}
	}


	/**
	 * Marks a position as dirty in the relevant map chunk.
	 * Passed down to MapLayer instances.
	 *
	 * @param {number} x - The x position of the dirty tile.
	 * @param {number} y - The y position of the dirty tile.
	 */

	private handleDirty = (layerIndex: number, x: number, y: number) => {
		this.chunks[layerIndex][Math.floor(y / CHUNK_SIZE)][Math.floor(x / CHUNK_SIZE)].setDirty(new Vec2(x % CHUNK_SIZE, y % CHUNK_SIZE));
	};
}

import * as Phaser from 'phaser';

import MapLayer from './MapLayer';
import TileStore from './TileStore';
import * as MapSaver from './MapSaver';
import TokenManager from './token/TokenManager';
import MapChunk, { CHUNK_SIZE } from './MapChunk';
import HighlightMapChunk from './HighlightMapChunk';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';


/**
 * Main map controller that manages the map data and chunks.
 */

export default class Map {
	identifier: string = '';
	size: Vec2 = new Vec2(2, 2);
	tileStore: TileStore = new TileStore();

	tokens: TokenManager = new TokenManager();
	
	private layers: MapLayer[] = [];
	private highlightLayer?: MapLayer;
	private activeLayer?: MapLayer = undefined;

	private scene: Phaser.Scene = undefined as any;
	private chunks: MapChunk[][][] = [];
	private highlights: HighlightMapChunk[][] = [];

	init(scene: Phaser.Scene, assets: Asset[]) {
		this.scene = scene;

		this.tokens.init(scene);
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

		for (let chunkRow of this.highlights) {
			for (let chunk of chunkRow) {
				if (Date.now() - start > 4) return;
				chunk.redraw();
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
		if (layer === -1) return this.highlightLayer;
		return this.layers[layer];
	}


	/**
	 * Gets the active layer.
	 */

	getActiveLayer(): MapLayer | undefined {
		return this.activeLayer;
	}


	/**
	 * Gets the highlight layer.
	 */

	getHighlightLayer(): MapLayer | undefined {
		return this.highlightLayer;
	}


	/**
	 * Sets the active layer to the layer or index specified.
	 */

	setActiveLayer(l: MapLayer | number) {
		if (l instanceof MapLayer) l = l.index;
		this.activeLayer = this.layers[l];
		this.updateLayerVisibility();
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
		this.createMapChunks(layer);

		return layer;
	}


	/**
	 * Removes a map layer at the specfied index.
	 *
	 * @param {number} index - the index that the layer should be removed at.
	 */

	removeLayer(index: number) {
		const layer = this.layers[index];
		this.layers.splice(index, 1);
		for (let i = index; i < this.layers.length; i++) this.layers[i].index = i;
		if (this.activeLayer === layer) this.setActiveLayer(this.layers[Math.min(Math.max(index, 0), this.layers.length - 1)]);
		this.updateMapChunks();
	}


	/**
	 * Returns a serialized map string representing the map.
	 *
	 * @returns {string} - a serialized map string.
	 */

	save(): string {
		return MapSaver.save(this.size, this.identifier, this.layers, this.tokens);
	}


	/**
	 * Loads a serialized map string into this map.
	 *
	 * @param {string} mapData - the serialized map.
	 */

	load(mapData: string) {
		const data = MapSaver.load(mapData);
		this.size = new Vec2(data.size);
		this.identifier = data.identifier;

		this.tokens.resetTokens(data.tokens);

		this.layers = data.layers;
		if (this.layers.length === 0) this.layers.push(new MapLayer(0, this.size));
		this.layers.forEach(l => {
			l.init(this.handleDirty.bind(this, l.index));
			this.createMapChunks(l);
		});

		this.createHighlightLayer();
		this.activeLayer = this.layers[0];
	}


	/**
	 * Creates a visual representation of the map.
	 *
	 * @param {Phaser.Scene} scene - The scene to add the chunks to.
	 */

	private createMapChunks(layer: MapLayer) {
		if (this.chunks[layer.index]) this.chunks[layer.index].forEach(cA => cA.forEach(c => c.destroy()));

		this.chunks[layer.index] = [];
		for (let i = 0; i < Math.ceil(this.size.y / CHUNK_SIZE); i++) {
			this.chunks[layer.index][i] = [];
			for (let j = 0; j < Math.ceil(this.size.x / CHUNK_SIZE); j++) {
				const chunk = new MapChunk(this.scene, new Vec2(j, i), layer, this.tileStore);
				chunk.setShadow(layer.index > (this.activeLayer?.index ?? 0));
				this.chunks[layer.index][i][j] = chunk;
			}
		}
	}


	/**
	 * Refreshes the highlight chunks for the map.
	 *
	 * @param {Phaser.Scene} scene - The scene to add the chunks to.
	 */

	private createHighlightLayer() {
		this.highlightLayer = new MapLayer(-1, this.size);
		this.highlightLayer.init((x: number, y: number) =>
			this.highlights[Math.floor(y / CHUNK_SIZE)][Math.floor(x / CHUNK_SIZE)].setDirty(new Vec2(x % CHUNK_SIZE, y % CHUNK_SIZE)));

		this.highlights.forEach(cR => cR.forEach(c => c.destroy()));
		this.highlights = [];

		for (let i = 0; i < Math.ceil(this.size.y / CHUNK_SIZE); i++) {
			this.highlights[i] = [];
			for (let j = 0; j < Math.ceil(this.size.x / CHUNK_SIZE); j++) {
				const chunk = new HighlightMapChunk(this.scene, new Vec2(j, i), this.highlightLayer);
				this.highlights[i][j] = chunk;
			}
		}
	}


	/**
	 * Removes orphaned MapChunks and updates their depth.
	 */

	private updateMapChunks() {
		for (let i = 0; i < this.chunks.length; i++) {
			const chunks = this.chunks[i];

			if (!this.layers.includes(chunks[0][0].layer)) {
				// Kill the chunks, the layer is dead.
				chunks.forEach(cA => cA.forEach(c => c.destroy()));
				this.chunks.splice(i--, 1);
			}
			else chunks.forEach(cA => cA.forEach(c => c.updateDepth()));
		}
	}


	/**
	 * Shows or hides layers based on the active layer.
	 */

	private updateLayerVisibility() {
		const index = (this.activeLayer?.index) ?? 0;
		this.chunks.forEach((a, i) => a.forEach(cA => cA.forEach(c => c.setShadow(i > index))));
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

import MapLayer, { LAYER_SERIALIZATION_ORDER } from './MapLayer';

import { Vec2 } from '../util/Vec';
import * as Buffer from '../util/Buffer';

/** Data pretaining to a deserialized map. */
export interface DeserializedMap {
	size: Vec2;
	layers: MapLayer[];
}


/**
 * Takes a map size and array of layers and returns a serialized map string.
 *
 * @param {Vec2} size - The size of the map.
 * @param {Vec2} layers - A list of map layers.
 * @returns {string} - a serialized map string.
 */

export function save(size: Vec2, layers: MapLayer[]): string {
	let mapData = '';

	const mapMeta = {
		format: '1.0.0',
		size: size
	};

	const mapMetaStr = JSON.stringify(mapMeta);
	mapData += mapMetaStr.length + '|' + mapMetaStr;

	for (const layer of layers) {
		let layerStr = '';

		for (const mapLayer of LAYER_SERIALIZATION_ORDER) {

			const tileBuff = new ArrayBuffer(2 * size.x * size.y);
			const tileIndBuff = new ArrayBuffer(size.x * size.y);
			const tileArr = new Uint16Array(tileBuff);
			const tileIndArr = new Uint8Array(tileIndBuff);

			for (let i = 0; i < size.x * size.y; i++) {
				const x = i % size.x;
				const y = Math.floor(i / size.x);
				tileArr[i] = layer.getTile(mapLayer, new Vec2(x, y));
				tileIndArr[i] = layer.getTileIndex(mapLayer, new Vec2(x, y));
			}

			const tileStr = Buffer.serialize(tileBuff);
			const tileIndStr = Buffer.serialize(tileIndBuff);

			layerStr += tileStr.length + '|' + tileStr;
			layerStr += tileIndStr.length + '|' + tileIndStr;
		}

		mapData += layerStr.length + '|' + layerStr;
	}

	return mapData;
}


/**
 * Takes a serialized map and returns the deserialized map data.
 *
 * @param {string} mapData - The serialized map data.
 * @returns {DeserializedMap} - the deserialized map.
 */

export function load(mapData: string): DeserializedMap {
	const numEnd = mapData.indexOf('|');
	const num = Number.parseInt(mapData.substr(0, numEnd), 10);

	const mapMeta = JSON.parse(mapData.slice(numEnd + 1, numEnd + 1 + num));
	mapData = mapData.substr(numEnd + num + 1);

	const data: DeserializedMap = { ...mapMeta, layers: [] };

	let layerInd = 0;
	while (mapData.length) {
		const numEnd = mapData.indexOf('|');
		const num = Number.parseInt(mapData.substr(0, numEnd), 10);

		const layer = new MapLayer(layerInd++, data.size);
		layer.load(mapData.slice(numEnd + 1, numEnd + 1 + num));
		data.layers.push(layer);

		mapData = mapData.substr(numEnd + num + 1);
	}

	return data;
}

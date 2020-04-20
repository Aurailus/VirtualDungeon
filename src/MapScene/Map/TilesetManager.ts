class TilesetManager {
	scene: MapScene;

	private currentWallInd: number = 0;
	private currentGroundInd: number = 0;
	private currentOverlayInd: number = 0;

	wallLocations: 		{[key: number /*Index*/]: { res: number, ind: number, key: string }} = {};
	groundLocations: 	{[key: number /*Index*/]: { res: number, ind: number, key: string }} = {};
	overlayLocations: {[key: number /*Index*/]: { res: number, ind: number, key: string }} = {};
	indexes:          {[key: string /*Tileset Key*/]: number} = {};

	constructor(scene: MapScene) {
		this.scene = scene;

		for (let tileset of WALLS   ) this.addTileset(tileset.key, Layer.wall);
		for (let tileset of GROUNDS ) this.addTileset(tileset.key, Layer.floor);
		for (let tileset of OVERLAYS) this.addTileset(tileset.key, Layer.overlay);
	}

	private addTileset(key: string, layer: Layer): void {
		let res = this.scene.textures.get(key).getSourceImage(0).width / 9;
		let ind = (layer == Layer.wall ? this.currentWallInd : layer == Layer.floor ? this.currentGroundInd : this.currentOverlayInd);
		this[layer == Layer.wall ? "wallLocations" : layer == Layer.floor ? "groundLocations" : "overlayLocations"][ind] = { res: res, ind: ind, key: key };
		this.indexes[key] = ind;
		
		layer == Layer.wall 	? this.currentWallInd++   :
		layer == Layer.floor  ? this.currentGroundInd++ :
														this.currentOverlayInd++;
	}
}

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
	}

	init(assets: LoadedAsset[]) {
		for (let tileset of assets.filter(a => a.type == AssetType.WALL   )) this.addTileset(tileset.identifier, Layer.wall);
		for (let tileset of assets.filter(a => a.type == AssetType.GROUND )) this.addTileset(tileset.identifier, Layer.floor);
		for (let tileset of assets.filter(a => a.type == AssetType.OVERLAY)) this.addTileset(tileset.identifier, Layer.overlay);
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

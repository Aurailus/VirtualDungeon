enum AssetType {
	GROUND, WALL, OVERLAY, TOKEN
}

interface LoadedAsset {
	type: AssetType;
	name: string;
	
	identifier: string;
	key: string; //Set by LoadScene
	path: string;
	size: number;

	tileSize: Vec2;
	spriteSize?: Vec2;
}

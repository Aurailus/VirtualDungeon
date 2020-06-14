enum AssetType {
	GROUND, WALL, OVERLAY, TOKEN
}

interface LoadedAsset {
	type: AssetType;
	name: string;
	
	identifier: string;
	path: string;
	size: Vec2;
}

class Lighting {
	scene: MapScene;
	size: Vec2;

	private chunks: LightChunk[][] = [];

	lightSources: LightSource[] = [];

	constructor(scene: MapScene, size: Vec2) {
		this.scene = scene;
		this.size = size;

		for (let i = 0; i < Math.ceil(size.y / (MapChunk.CHUNK_SIZE * 2)); i++) {
			this.chunks[i] = [];
			for (let j = 0; j < Math.ceil(size.x / (MapChunk.CHUNK_SIZE * 2)); j++) {
				this.chunks[i][j] = new LightChunk(this, j, i);
			}
		}

		this.addLightSource(18*16, 18*16, 12*16, 1);
		this.addLightSource(32*16, 32*16, 12*16, 1);
		this.addLightSource(14*16, 36*16, 12*16, 1);
	}

	update() {
		if (this.scene.i.keyPressed('R')) {
			this.updateAround(0, 0, 1000);
		}
	}

	updateAround(x: number, y: number, radius: number) {
		const minChunkPos = new Vec2(clamp(Math.floor((x - radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1), 
			clamp(Math.floor((y - radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));
		const maxChunkPos = new Vec2(clamp(Math.ceil((x + radius) / LightChunk.CHUNK_SIZE), 0, this.chunks[0].length - 1), 
			clamp(Math.ceil((y + radius) / LightChunk.CHUNK_SIZE), 0, this.chunks.length - 1));

		for (let i = minChunkPos.x; i < maxChunkPos.x; i++) {
			for (let j = minChunkPos.y; j < maxChunkPos.y; j++) {
				this.chunks[j][i].build();
			}
		}
	}

	addLightSource(x: number, y: number, radius?: number, intensity?: number ) {
		let s = new LightSource(this, x, y);
		if (radius !== undefined) s.setRadius(radius);
		if (intensity !== undefined) s.setIntensity(intensity);
		this.lightSources.push(s);
		this.updateAround(x, y, radius);
	}
}

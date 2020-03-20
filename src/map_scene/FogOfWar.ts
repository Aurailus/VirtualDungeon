class FogOfWar {
	scene: MapScene;

	tex: Phaser.GameObjects.RenderTexture;
	map: Phaser.Tilemaps.Tilemap;
	historyLayer: Phaser.Tilemaps.DynamicTilemapLayer;
	
	dims: Vec2;

	constructor(scene: MapScene, dims: Vec2) {
		this.scene = scene;
		this.dims = dims;

		this.tex = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, this.dims.x*16, this.dims.y*16);
		this.tex.setScale(4, 4);
		this.tex.setAlpha(0.7);
		this.scene.add.existing(this.tex);

		// this.map = this.scene.add.tilemap(null, 16, 16, 0, 0);
		// this.map.addTilesetImage("history", "wall_shadow", 16, 16, 0, 0);
		// this.map.setLayer("history");
		// this.historyLayer = this.map.createBlankDynamicLayer("history", "wall_shadow", 0, 0, this.dims.x, this.dims.y, 16, 16);
		// this.historyLayer.setScale(4, 4);

		// for (let i = 0; i < this.dims.x; i++) {
		// 	for (let j = 0; j < this.dims.y; j++) {
		// 		if ((j % 2 == 0 && i % 2 == 0) || (j % 2 != 0 && i % 2 != 0)) this.historyLayer.putTileAt(0, i, j);
		// 	}
		// }

	}

	update() {
		let resetSquare = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.dims.x*16, this.dims.y*16, 0x000000);
		this.tex.draw(resetSquare);

		for (let token of this.scene.tokens) {
			let startTile = new Vec2(Math.floor(token.x / 64), Math.floor(token.y / 64))

			let points: Vec2[] = [];

			for (let i = 0; i < 144; i++) {
				let ray = new Vec2(0.5, 0.5);
				let dir = new Vec2(Math.cos(i * 2.5 * (Math.PI / 180)) / 16, Math.sin(i * 2.5 * (Math.PI / 180)) / 16);

				let dist = 0;
				let maxDist = 12;

				while (this.scene.map.getWall(Math.floor(startTile.x + ray.x), Math.floor(startTile.y + ray.y)) == -1 && 
					(dist = Math.sqrt(Math.pow(ray.x, 2) + Math.pow(ray.y, 2))) < maxDist) {
					ray.x += dir.x;
					ray.y += dir.y;
				}

				ray.x -= dir.x * maxDist * 1.2;
				ray.y -= dir.y * maxDist * 1.2;

				ray.x += dir.x * ((maxDist - dist) * 1.4);
				ray.y += dir.y * ((maxDist - dist) * 1.4);

				points.push(new Vec2(ray.x * 4, ray.y * 4));
			}

			let poly = new Phaser.GameObjects.Polygon(this.scene, token.x / 4, token.y / 4, points, 0xffffff, 0.4);
			poly.setScale(4, 4);
			poly.setBlendMode('ERASE');
			poly.setDisplayOrigin(0, 0);
			poly.setOrigin(0, 0);

			for (let i = 0; i < 10; i++) {
				poly.scaleX += 0.04;
				poly.scaleY += 0.04;
				// poly.x = token.x / 4 + 50 * poly.scaleX;
				// poly.y = token.y / 4 + 50 * poly.scaleY;
				this.tex.draw(poly);
			}
		}
	}
}

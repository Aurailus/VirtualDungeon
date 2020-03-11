class TilesetPatcher {
	constructor(scene: Phaser.Scene) {
		let renderTex = new Phaser.GameObjects.RenderTexture(scene, 0, 0, 9 * 16, 7 * 16 * 8);
		renderTex.drawFrame("tileset_0", 0, 0, 7 * 16 * 0);
		renderTex.drawFrame("tileset_1", 0, 0, 7 * 16 * 1);
		renderTex.drawFrame("tileset_2", 0, 0, 7 * 16 * 2);

		scene.add.existing(renderTex);
		// scene.textures.addRenderTexture("tileset_16x", renderTex);

		// let spr = scene.add.sprite(300, 300, "tileset_16x");
		// console.log(spr);
	}
}

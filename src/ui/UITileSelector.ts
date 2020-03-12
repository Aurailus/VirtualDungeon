class UITileSelector extends UIContainer {
	scene: MainScene;

	background: Phaser.GameObjects.Sprite;
	tileSprites: Phaser.GameObjects.Sprite[];

	tiles: number[] = [];
	selectSprite: Phaser.GameObjects.Sprite;

	constructor(scene: MainScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;

		this.background = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ui_quick_selector");
		this.background.setScale(3, 3);
		this.background.setOrigin(0, 0);
		this.intersects.push(this.background);
		this.add(this.background);

		this.selectSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "cursor");
		this.selectSprite.setScale(3, 3);
		this.selectSprite.setOrigin(0, 0);
		this.add(this.selectSprite);
		this.positionSelect(0);
	}

	positionSelect(slot: number) {
		this.selectSprite.setPosition(12, 18 + slot*60);	
	}

	update() {
		if (this.mouseIntersects() && this.scene.input.mousePointer.leftButtonDown()) {
			let mousePos = this.mousePos();
			if (mousePos.x < 4 || mousePos.x > 4 + 16) return;

			mousePos.y -= 6;
			if (mousePos.y % 20 > 16) return;

			let slot = Math.floor(mousePos.y / 20);
			if (slot < 0 || slot >= this.tiles.length) return;
			this.scene.activeTileset = this.tiles[slot];
			this.positionSelect(slot);
		}
	}

	addTile(tile: number) {
		let pos = this.tiles.length;
		this.tiles.push(tile);

		let spr = new Phaser.GameObjects.Sprite(this.scene, 12 - 22*2, 18 - 22*2 + pos*60, "tileset_" + tile);
		spr.setOrigin(0, 0);
		spr.setCrop(22, 22, 24, 24);
		spr.setScale(2);
		this.add(spr);
		this.sendToBack(spr);
		this.sendToBack(this.background);
	}
}

class UITileSidebar extends UISidebar {
	
	constructor(scene: MainScene, x: number, y: number) {
		super(scene, x, y);
	}

	elemClick(x: number, y: number): void {
		this.scene.activePalette = this.elems[x + y * 3];
	}

	addPalette(tile: number) {
		let p = this.elems.length;
		let x = p % 3;
		let y = Math.floor(p / 3);
		this.elems.push(tile);

		let spr = new Phaser.GameObjects.Sprite(this.scene, 12 + x * 21 * 3 - 22 * 2, 12 + y * 21 * 3 - 22 * 2, "tileset_" + tile);
		spr.setOrigin(0, 0);
		spr.setCrop(21, 21, 26, 26);
		spr.setScale(2);
		this.sprites.push(spr);
		this.list.push(spr);
		let spr2 = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_overlay");
		spr2.setScale(3);
		spr2.setOrigin(0, 0);
		this.list.push(spr2);

		this.bringToTop(this.hoverSpriteCursor);
		this.bringToTop(this.activeSpriteCursor);
	}
}

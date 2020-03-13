class UITileSidebar extends UISidebar {
	
	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y);

		for (let tileset of WALLS) {
			this.addTileset(tileset.key);
		}

		for (let tileset of GROUNDS) {
			this.addTileset(tileset.key);
		}
	}

	elemClick(x: number, y: number): void {
		console.log( this.scene.map.manager.indexes[this.elems[x + y * 3]]);
		this.scene.activeTileset = this.scene.map.manager.indexes[this.elems[x + y * 3]];
	}

	addTileset(tileset: string) {
		let p = this.elems.length;
		let x = p % 3;
		let y = Math.floor(p / 3) + 1;
		this.elems.push(tileset);

		let spr = new Phaser.GameObjects.Sprite(this.scene, 12 + x * 21 * 3 - 187, 12 + y * 21 * 3 - 2, tileset);
		spr.setOrigin(0, 0);
		spr.setCrop(112, 0, 32, 32);
		spr.setScale(1.65);
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

class UITileSidebar extends UISidebar {
	
	walls: string[] = [];
	grounds: string[] = [];
	holes: string[] = [];

	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y);


		let add_wall = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_browse");
		add_wall.setName("add_wall");
		add_wall.setScale(3);
		add_wall.setOrigin(0, 0);
		this.list.push(add_wall);
		this.sprites.push(add_wall);

		for (let tileset of WALLS) {
			this.addWall(tileset.key);
		}
		
		let add_ground = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + y * 21 * 3, "ui_sidebar_browse");
		add_ground.setName("add_ground");
		add_ground.setScale(3);
		add_ground.setOrigin(0, 0);
		this.list.push(add_ground);
		this.sprites.push(add_ground);

		for (let tileset of GROUNDS) {
			this.addGround(tileset.key);
		}

		let add_hole = new Phaser.GameObjects.Sprite(this.scene, 9 + x * 21 * 3, 9 + 9 * 21 * 3, "ui_sidebar_browse");
		add_hole.setName("add_hole");
		add_hole.setScale(3);
		add_hole.setOrigin(0, 0);
		this.list.push(add_hole);
		this.sprites.push(add_hole);

		for (let i = 0; i < 12; i++) {
			if (i % 4 != 0) this.backgrounds[i].setFrame(0);
		}
	}

	elemClick(x: number, y: number): void {
		if (y < 4) this.scene.activeTileset = this.scene.map.manager.indexes[this.walls[x + y * 3]];
		else this.scene.activeTileset = this.scene.map.manager.indexes[this.grounds[x + (y - 4) * 3]];
	}

	private addWall(tileset: string): void {
		this.addTilesetSprite(tileset, this.walls.length % 3, Math.floor(this.walls.length / 3) + 1, 17);
		(this.getByName("add_wall") as Phaser.GameObjects.Sprite).x = 9 + ((this.walls.length + 1) % 3 * 21 * 3);
		(this.getByName("add_wall") as Phaser.GameObjects.Sprite).y = 9 + (Math.floor((this.walls.length + 1) / 3 + 1) * 21 * 3);
		this.walls.push(tileset);
	}

	private addGround(tileset: string): void {
		this.addTilesetSprite(tileset, this.grounds.length % 3, Math.floor(this.grounds.length / 3) + 5, 13);
		(this.getByName("add_ground") as Phaser.GameObjects.Sprite).x = 9 + ((this.grounds.length + 1) % 3 * 21 * 3);
		(this.getByName("add_ground") as Phaser.GameObjects.Sprite).y = 9 + (Math.floor((this.grounds.length + 1) / 3 + 5) * 21 * 3);
		this.grounds.push(tileset);
	}

	private addTilesetSprite(key: string, x: number, y: number, frame: number) {
		let spr = new Phaser.GameObjects.Sprite(this.scene, 12 + x * 21 * 3, 12 + y * 21 * 3, key, frame);
		spr.setOrigin(0, 0);
		spr.setScale(3);
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

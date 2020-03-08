class ArchitectMode {
	scene: MainScene;
	active: boolean = false;

	cursor: Phaser.GameObjects.Sprite;

	pointerDown: boolean = false;
	manipulated: {pos: Vec2, solid: boolean}[] = [];

	constructor(scene: MainScene) {
		this.scene = scene;

		// Create cursor hover sprite
		this.cursor = this.scene.add.sprite(0, 0, "cursor");
		this.cursor.setScale(4, 4);
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);
	}

	update() {
		this.active = true;
		this.cursor.setVisible(true);

		let selectedTilePos = new Vec2(Math.floor(this.scene.world.cursorWorld.x / 64), Math.floor(this.scene.world.cursorWorld.y / 64))
		this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);

		this.cursor.setVisible((selectedTilePos.x >= 0 && selectedTilePos.y >= 0 && 
			selectedTilePos.x < this.scene.map.dimensions.x && selectedTilePos.y < this.scene.map.dimensions.y));

		if (this.scene.input.activePointer.isDown && !this.pointerDown) this.pointerDown = true;
		else if (!this.scene.input.activePointer.isDown && this.pointerDown) {
			if (this.manipulated.length != 0) {
				this.scene.history.push("tile", this.manipulated);
				this.manipulated = [];
			}
			this.pointerDown = false;
		}

		if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
			let change = new Vec2(this.scene.world.cursorWorld.x - this.scene.world.lastCursorWorld.x, 
				this.scene.world.cursorWorld.y - this.scene.world.lastCursorWorld.y);

			let normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
			change.x /= normalizeFactor;
			change.y /= normalizeFactor;

			let place = new Vec2(this.scene.world.lastCursorWorld.x, this.scene.world.lastCursorWorld.y);

			while (Math.abs(this.scene.world.cursorWorld.x - place.x) >= 1 || Math.abs(this.scene.world.cursorWorld.y - place.y) >= 1) {
				if (this.scene.map.setSolid(Math.floor(place.x / 64), Math.floor(place.y / 64), this.scene.input.mousePointer.rightButtonDown())) {
					this.manipulated.push({pos: new Vec2(Math.floor(place.x / 64), Math.floor(place.y / 64)), solid: this.scene.input.mousePointer.rightButtonDown()});
				}
				place.x += change.x;
				place.y += change.y;
			}
			if (this.scene.map.setSolid(selectedTilePos.x, selectedTilePos.y, this.scene.input.mousePointer.rightButtonDown())) {
				this.manipulated.push({pos: selectedTilePos, solid: this.scene.input.mousePointer.rightButtonDown()});
			}
		}
	}

	cleanup() {
		if (!this.active) return;
		this.active = false;

		this.cursor.setVisible(false);
	}
}

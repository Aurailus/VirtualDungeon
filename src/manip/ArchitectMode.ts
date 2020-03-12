class ArchitectMode {
	scene: MainScene;
	active: boolean = false;

	cursor: Phaser.GameObjects.Sprite;
	primitives: Phaser.GameObjects.Line[] = [];

	startTilePos: Vec2 = new Vec2();
	placeMode: string = "brush";
	pointerDown: boolean = false;
	pointerPrimaryDown: boolean = false;

	manipulated: {pos: Vec2, lastWall: number, wall: number}[] = [];

	constructor(scene: MainScene) {
		this.scene = scene;

		// Create cursor hover sprite
		this.cursor = this.scene.add.sprite(0, 0, "cursor");
		this.cursor.setScale(4, 4);
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);

		this.scene.snapKey.addListener("down", () => { if (!this.scene.input.activePointer.isDown) this.placeMode = "line" });
		this.scene.modifierKey.addListener("down", () => { if (!this.scene.input.activePointer.isDown) this.placeMode = "rect" });
		this.scene.snapKey.addListener("up", () => { if (!this.scene.input.activePointer.isDown) this.placeMode = "brush" });
		this.scene.modifierKey.addListener("up", () => { if (!this.scene.input.activePointer.isDown) this.placeMode = "brush" });
	}

	update() {
		this.active = true;
		this.cursor.setVisible(true);

		let selectedTilePos = new Vec2(Math.floor(this.scene.world.cursorWorld.x / 64), Math.floor(this.scene.world.cursorWorld.y / 64))
		this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);

		this.cursor.setVisible((selectedTilePos.x >= 0 && selectedTilePos.y >= 0 && 
			selectedTilePos.x < this.scene.map.dimensions.x && selectedTilePos.y < this.scene.map.dimensions.y));

		// Place Tiles
		switch(this.placeMode) {
			case "brush": {
				this.drawBrush(selectedTilePos);
				break;
			}
			case "line": {
				this.drawLine(selectedTilePos);
				break;
			}
			case "rect": {
				this.drawRect(selectedTilePos);
				break;
			}
		}

		// Push history to HistoryManager
		if (this.scene.input.activePointer.isDown && !this.pointerDown) {
			this.pointerDown = true;
			this.pointerPrimaryDown = this.scene.input.activePointer.leftButtonDown();
		}
		else if (!this.scene.input.activePointer.isDown && this.pointerDown) {
			if (this.manipulated.length != 0) {
				this.scene.history.push("tile", this.manipulated);
				this.manipulated = [];
			}
			this.pointerDown = false;
			this.pointerPrimaryDown = false;
		}
	}

	drawLine(selectedTilePos: Vec2) {
		if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
			if (!this.pointerDown) this.startTilePos = selectedTilePos;

			let a = new Vec2(this.startTilePos.x, this.startTilePos.y);
			let b = new Vec2(selectedTilePos.x, selectedTilePos.y);

			if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y)) b.y = a.y;
			else b.x = a.x;

			this.cursor.setPosition(b.x * 64, b.y * 64);

			this.primitives.forEach((v) => v.destroy());
			this.primitives = [];

			this.primitives.push(this.scene.add.line(0, 0, a.x + 0.5, a.y + 0.5, b.x + 0.5, b.y + 0.5, 0xffffff, 1));

			this.primitives.forEach((v) => {
				v.setOrigin(0, 0);
				v.setScale(64, 64);
				v.setLineWidth(0.03);
				v.setDepth(300);
			});

			this.primitives.push(this.scene.add.sprite(this.startTilePos.x * 64, this.startTilePos.y * 64, "cursor") as any as Phaser.GameObjects.Line);
			this.primitives[1].setOrigin(0, 0);
			this.primitives[1].setScale(4, 4);
			this.primitives[1].setAlpha(0.5);
		}

		else if (!this.scene.input.mousePointer.leftButtonDown() && !this.scene.input.mousePointer.rightButtonDown() && this.pointerDown) {
			let a = new Vec2(this.startTilePos.x * 64, this.startTilePos.y * 64);
			let b = new Vec2(selectedTilePos.x * 64, selectedTilePos.y * 64);
			
			if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y)) b.y = a.y;
			else b.x = a.x;

			let change = new Vec2(b.x - a.x, b.y - a.y);
			let normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
			change.x /= normalizeFactor;
			change.y /= normalizeFactor;

			while (Math.abs(b.x - a.x) >= 1 || Math.abs(b.y - a.y) >= 1) {
				this.placeTileAndPushManip(new Vec2(Math.floor(a.x / 64), Math.floor(a.y / 64)), this.pointerPrimaryDown);
				a.x += change.x;
				a.y += change.y;
			}

			this.placeTileAndPushManip(new Vec2(b.x / 64, b.y / 64), this.pointerPrimaryDown);
			this.primitives.forEach((v) => v.destroy());
			this.primitives = [];
		}
	}

	drawRect(selectedTilePos: Vec2) {
		if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
			if (!this.pointerDown) this.startTilePos = selectedTilePos;

			let a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
			let b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));

			this.primitives.forEach((v) => v.destroy());
			this.primitives = [];

			const fac = 0.03;
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac, b.x + 1 - fac, a.y + fac, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac / 2, a.x + fac, b.y + 1 - fac / 2, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, b.y + 1 - fac, b.x + 1 - fac, b.y + 1 - fac, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, b.x + 1 - fac, a.y + fac / 2, b.x + 1 - fac, b.y + 1 - fac / 2, 0xffffff, 1));

			this.primitives.forEach((v) => {
				v.setOrigin(0, 0);
				v.setScale(64, 64);
				v.setLineWidth(0.03);
				v.setDepth(300);
			});
		}

		else if (!this.scene.input.mousePointer.leftButtonDown() && !this.scene.input.mousePointer.rightButtonDown() && this.pointerDown) {
			let a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
			let b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));

			for (let i = a.x; i <= b.x; i++) {
				for (let j = a.y; j <= b.y; j++) {
					this.placeTileAndPushManip(new Vec2(i, j), this.pointerPrimaryDown);
				}
			}

			this.primitives.forEach((v) => v.destroy());
			this.primitives = [];
		}
	}

	drawBrush(selectedTilePos: Vec2) {
		if (this.scene.input.mousePointer.leftButtonDown() || this.scene.input.mousePointer.rightButtonDown()) {
			let change = new Vec2(this.scene.world.cursorWorld.x - this.scene.world.lastCursorWorld.x, 
				this.scene.world.cursorWorld.y - this.scene.world.lastCursorWorld.y);

			let normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
			change.x /= normalizeFactor;
			change.y /= normalizeFactor;

			let place = new Vec2(this.scene.world.lastCursorWorld.x, this.scene.world.lastCursorWorld.y);

			while (Math.abs(this.scene.world.cursorWorld.x - place.x) >= 1 || Math.abs(this.scene.world.cursorWorld.y - place.y) >= 1) {
				this.placeTileAndPushManip(new Vec2(Math.floor(place.x / 64), Math.floor(place.y / 64)), this.scene.input.mousePointer.leftButtonDown());
				place.x += change.x;
				place.y += change.y;
			}

			this.placeTileAndPushManip(new Vec2(selectedTilePos.x, selectedTilePos.y), this.scene.input.mousePointer.leftButtonDown());
		}
	}

	placeTileAndPushManip(manipPos: Vec2, solid: boolean) {
		let tile = solid ? 1 : -1;

		let lastWall = this.scene.map.getWall(manipPos.x, manipPos.y);
		if (tile == lastWall) return;

		this.scene.map.setWall(manipPos.x, manipPos.y, tile);

		this.manipulated.push({
			pos: manipPos, 
			lastWall: lastWall, 
			wall: tile
		});

	}

	cleanup() {
		if (!this.active) return;
		this.active = false;

		this.cursor.setVisible(false);
	}
}

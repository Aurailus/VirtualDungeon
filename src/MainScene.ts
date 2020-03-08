class MainScene extends Phaser.Scene {
	map: TileMap;

	cursor: Phaser.GameObjects.Sprite;
	lastCursorScreenPos: Vec2;
	lastCursorWorldPos: Vec2;

	// world: WorldView;

	constructor() {
		super({key: "MainScene"});
	}

	preload(): void {
		this.cameras.main.setBackgroundColor("#003");

		this.load.image("cursor", "res/cursor.png");
		this.load.image("tileset", "res/tileset_3.png");
	}

	create(): void {
		// Create cursor hover sprite
		this.cursor = this.add.sprite(0, 0, "cursor");
		this.cursor.setScale(2, 2);
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);

		this.map = new TileMap("gameMap", this, 300, 300);
		this.map.fillMap(10);

		// Bind the scroll wheel event
		this.onWheel = this.onWheel.bind(this);
		document.documentElement.addEventListener("wheel", this.onWheel);
		this.events.on('destroy', () => document.documentElement.removeEventListener("wheel", this.onWheel));

		// Create UI
		// let cam = this.cameras.add(0, 0, 512, 512, false, "ui");
		// cam.setScroll(-10000, -10000);
		
		// let spr = this.add.sprite(-10000 + 64, -10000 + 64, "cursor");
	}

	private onWheel(e: WheelEvent) {
		let dir = e.deltaY < 0;
		this.cameras.main.setZoom(this.cameras.main.zoom * (dir ? 1.1 : 0.9));
	}

	private handleArchitectMode(cursorScreenPos: Vec2, cursorWorldPos: Vec2) {
		let selectedTilePos = new Vec2(Math.floor(cursorWorldPos.x / 64), Math.floor(cursorWorldPos.y / 64))
		this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);

		if (this.input.mousePointer.leftButtonDown() || this.input.mousePointer.rightButtonDown()) {
			let change = new Vec2(cursorWorldPos.x - this.lastCursorWorldPos.x, cursorWorldPos.y - this.lastCursorWorldPos.y);
			let normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
			change.x /= normalizeFactor;
			change.y /= normalizeFactor;

			let place = new Vec2(this.lastCursorWorldPos.x, this.lastCursorWorldPos.y);

			while (Math.abs(cursorWorldPos.x - place.x) >= 1 || Math.abs(cursorWorldPos.y - place.y) >= 1) {
				this.map.setSolid(Math.floor(place.x / 64), Math.floor(place.y / 64), this.input.mousePointer.rightButtonDown());
				place.x += change.x;
				place.y += change.y;
			}
			this.map.setSolid(selectedTilePos.x, selectedTilePos.y, this.input.mousePointer.rightButtonDown());
		}
	}

	private handlePanning(cursorScreenPos: Vec2, cursorWorldPos: Vec2) {
		if (this.input.mousePointer.middleButtonDown()) {
			this.cameras.main.scrollX += (this.lastCursorScreenPos.x - cursorScreenPos.x) / this.cameras.main.zoom;
			this.cameras.main.scrollY += (this.lastCursorScreenPos.y - cursorScreenPos.y) / this.cameras.main.zoom;
		}
	}

	update(time: number, delta: number): void {
		console.log(this.cameras.main.displayWidth - this.cameras.main.width);
		let cursorScreenPos = new Vec2(this.input.mousePointer.x, this.input.mousePointer.y);
		let cursorWorldPos = new Vec2(cursorScreenPos.x / this.cameras.main.zoom + this.cameras.main.scrollX - ((this.cameras.main.displayWidth - this.cameras.main.width) / 2), 
																  cursorScreenPos.y / this.cameras.main.zoom + this.cameras.main.scrollY - ((this.cameras.main.displayHeight - this.cameras.main.height) / 2));

		this.handleArchitectMode(cursorScreenPos, cursorWorldPos);
		this.handlePanning(cursorScreenPos, cursorWorldPos);

		this.lastCursorScreenPos = cursorScreenPos;
		this.lastCursorWorldPos = cursorWorldPos;
	}
}
 

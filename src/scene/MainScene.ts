class MainScene extends Phaser.Scene {
	TILESET_COUNT = 3;

	map: Tilemap;
	history: HistoryManager;

	world: WorldView;
	ui: UIView;

	mode: number = 0;

	tokens: Token[] = [];

	architect: ArchitectMode;
	token: TokenMode;

	chat: Chat;

	timeHoldingHistoryKey: number = 0;
	activePalette: number = 0;
	activeToken: string = "tkn_treasure";

	snapKey: 				Phaser.Input.Keyboard.Key;
	modifierKey: 		Phaser.Input.Keyboard.Key;

	switchModeKey: 	Phaser.Input.Keyboard.Key;
	undoRedoKey: 		Phaser.Input.Keyboard.Key;
	redoKeyWin: 		Phaser.Input.Keyboard.Key;

	constructor() { super({key: "MainScene"}); }

	preload(): void {
		window.addEventListener('resize', () => {
			let frame = document.getElementById("game");
			this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
			this.chat.x = -10000 + this.cameras.main.width - 309;
		});
	}

	create(): void {
		this.snapKey 			 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
		this.modifierKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

		this.switchModeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
		this.undoRedoKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
		this.redoKeyWin    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);

		this.switchModeKey.addListener("down", () => { this.mode = this.mode == 0 ? 1 : 0 });
		this.undoRedoKey.addListener("down", () => { 
			if (!this.modifierKey.isDown) return;
			this.timeHoldingHistoryKey = 0;
			this.snapKey.isDown ? this.history.redo() : this.history.undo(); 
		});
		this.redoKeyWin.addListener("down", () => {
			this.timeHoldingHistoryKey = 0; 
			if (!this.modifierKey.isDown) return;
			this.history.redo(); 
		});

		(<Phaser.Renderer.WebGL.WebGLRenderer>this.game.renderer).addPipeline('outline', new OutlinePipeline(this.game));

		this.history = new HistoryManager(this);

		this.world = new WorldView(this);
		this.ui = new UIView(this);
		this.ui.createElements();

		this.chat = new Chat(this, -10000 + this.cameras.main.width - 309, this.cameras.main.height - 9);
		this.add.existing(this.chat);

		this.map = new Tilemap("gameMap", this, 300, 300);

		this.architect = new ArchitectMode(this);
		this.token = new TokenMode(this);

		// let tileset = new TilesetCanvas(this, 16, 16);
		// tileset.addPalette("tileset_ground_dirt");
		// tileset.addPalette("tileset_ground_grass");
		// tileset.addPalette("tileset_wall_wood");
		// tileset.addPalette("tileset_wall_stone");
		// // this.add.sprite(-300, 0, "cursor");
		// setTimeout(() => this.add.sprite(-300, 0, "tileset_16"), 100);

		let map = new TilesetManager(this);
		map.addTileset("tileset_ground_dirt", false);
		map.addTileset("tileset_ground_grass", false);
		map.addTileset("tileset_wall_stone", true);
		map.addTileset("tileset_wall_wood", true);

		this.add.sprite(-300, 0, "tileset_16_ground");
		this.add.sprite(-800, 0, "tileset_16_wall");
	}

	update(time: number, delta: number): void {
		this.world.update();
		this.ui.update();
		this.chat.update();

		if ((this.redoKeyWin.isDown || this.undoRedoKey.isDown) && this.modifierKey.isDown) {
			if (this.timeHoldingHistoryKey > 12 && this.timeHoldingHistoryKey % 3 == 0) {
				if (this.redoKeyWin.isDown) this.history.redo();
				else if (this.snapKey.isDown) this.history.redo();
				else this.history.undo();
			}
			this.timeHoldingHistoryKey++;
		}
		else {
			this.timeHoldingHistoryKey = 0;
		}

		if (this.mode == 0) {
			if (this.ui.uiActive) this.architect.cleanup();
			else {
				this.architect.update();
				this.token.cleanup();
			}
		}
		else {
			if (this.ui.uiActive) this.token.cleanup();
			else {
				this.token.update();
				this.architect.cleanup();
			}
		}
	}
}
 

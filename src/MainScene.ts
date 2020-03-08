class MainScene extends Phaser.Scene {
	TILESET_COUNT = 3;

	map: TileMap;
	history: HistoryManager;

	world: WorldView;
	ui: UIView;

	mode: number = 0;

	tokens: Token[] = [];

	architect: ArchitectMode;
	token: TokenMode;

	timeHoldingHistoryKey: number = 0;

	snapKey: 				Phaser.Input.Keyboard.Key;
	modifierKey: 		Phaser.Input.Keyboard.Key;

	switchModeKey: 	Phaser.Input.Keyboard.Key;
	undoRedoKey: 		Phaser.Input.Keyboard.Key;
	redoKeyWin: 		Phaser.Input.Keyboard.Key;

	constructor() { super({key: "MainScene"}); }

	preload(): void {
		this.load.image("cursor", "res/cursor.png");

		for (let i = 1; i <= this.TILESET_COUNT; i++)
			this.load.image("tileset_" + i, "res/tileset_" + i + ".png");

		this.load.image("grid_tile", "res/grid.png");

		this.load.image("player", "res/player.png");

		this.load.spritesheet("ui_mode_switch", "res/button_edit_mode.png", {frameWidth: 39, frameHeight: 18});
		this.load.spritesheet("ui_history_manipulation", "res/button_undo_redo.png", {frameWidth: 39, frameHeight: 18});
	}

	create(): void {
		this.snapKey 			 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
		this.modifierKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);

		this.switchModeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
		this.undoRedoKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
		this.redoKeyWin    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);

		this.switchModeKey.addListener('down', () => { this.mode = this.mode == 0 ? 1 : 0 });
		this.undoRedoKey.addListener('down', () => { 
			if (!this.modifierKey.isDown) return;
			this.timeHoldingHistoryKey = 0;
			this.snapKey.isDown ? this.history.redo() : this.history.undo(); 
		});
		this.redoKeyWin.addListener('down', () => {
			this.timeHoldingHistoryKey = 0; 
			if (!this.modifierKey.isDown) return;
			this.history.redo(); 
		});

		(<Phaser.Renderer.WebGL.WebGLRenderer>this.game.renderer).addPipeline('outline', new OutlinePipeline(this.game));

		this.history = new HistoryManager(this);

		this.world = new WorldView(this);
		this.ui = new UIView(this);

		this.map = new TileMap("gameMap", this, 300, 300);
		this.map.fillMap(10);

		this.architect = new ArchitectMode(this);
		this.token = new TokenMode(this);

		let edit = new UIModeSwitchButton(this, 1, 1);
		this.ui.o.add(edit);

		let history = new UIHistoryManipulation(this, 16, 1);
		this.ui.o.add(history);

		this.tokens.push(new Token(this, 64, 64, "player"));
	}

	update(time: number, delta: number): void {
		this.world.update();
		this.ui.update();

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
 

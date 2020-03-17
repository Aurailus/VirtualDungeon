class MapScene extends Phaser.Scene {
	i: InputManager;
	
	history: HistoryManager;

	architect: ArchitectMode;
	token: TokenMode;

	world: WorldView;
	map: Tilemap;
	ui: UIView;
	// chat: Chat;

	mode: number = 0;
	tokens: Token[] = [];

	constructor() { super({key: "MapScene"}); }

	preload(): void {
		window.addEventListener('resize', () => {
			let frame = document.getElementById("game");
			this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
			// this.chat.x = -10000 + this.cameras.main.width - 309;
		});
	}

	create(): void {
		this.i = new InputManager(this);

		(<Phaser.Renderer.WebGL.WebGLRenderer>this.game.renderer).addPipeline('outline', new OutlinePipeline(this.game));
		(<Phaser.Renderer.WebGL.WebGLRenderer>this.game.renderer).addPipeline('brighten', new BrightenPipeline(this.game));

		this.history = new HistoryManager(this);

		this.world = new WorldView(this);
		this.ui = new UIView(this);
		this.ui.createElements();

		// this.chat = new Chat(this, -10000 + this.cameras.main.width - 309, this.cameras.main.height - 9);
		// this.add.existing(this.chat);

		this.map = new Tilemap("gameMap", this, 300, 300);

		let map = this.add.sprite(-300, 0, "tileset_16_wall");
		map.setScale(3, 3);

		this.architect = new ArchitectMode(this);
		this.token = new TokenMode(this);
	}

	update(time: number, delta: number): void {
		this.i.update();

		this.world.update();
		this.ui.update();
		// this.chat.update();
		this.history.update();
		
		if (this.i.keyPressed('TAB')) this.mode = (this.mode == 0 ? 1 : 0);

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
 

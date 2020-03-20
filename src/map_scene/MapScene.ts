class MapScene extends Phaser.Scene {
	i: InputManager;
	
	history: HistoryManager;

	architect: ArchitectMode;
	token: TokenMode;

	world: WorldView;
	map: Tilemap;
	ui: UIView;

	fog: FogOfWar;

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

		this.map = new Tilemap("gameMap", this, 300, 300);
		
		this.architect = new ArchitectMode(this);
		this.token = new TokenMode(this);

		this.fog = new FogOfWar(this, new Vec2(300, 300));
	}

	update(time: number, delta: number): void {
		this.i.update();

		this.world.update();
		this.ui.update();
		// this.chat.update();
		this.history.update();

		this.fog.update();
		
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
 

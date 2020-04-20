class MapScene extends Phaser.Scene {
	i: InputManager;
	
	history: HistoryManager;

	architect: ArchitectMode;
	token: TokenMode;

	world: WorldView;
	map: MapData;
	lighting: Lighting;
	ui: UIView;


	mode: number = 0;
	tokens: Token[] = [];

	constructor() { super({key: "MapScene"}); }

	preload(): void {
		window.addEventListener('resize', () => {
			let frame = document.getElementById("game");
			this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
		});
	}

	create(): void {
		this.i = new InputManager(this);

		(this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('outline',  new OutlinePipeline(this.game));
		(this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('brighten', new BrightenPipeline(this.game));

		this.history = new HistoryManager(this);
		this.world = new WorldView(this);
		this.ui = new UIView(this);

		const size = new Vec2(300, 300);

		this.map = new MapData(this, size);
		this.lighting = new Lighting(this, size);
		
		this.architect = new ArchitectMode(this);
		this.token = new TokenMode(this);

	}

	update(time: number, delta: number): void {
		this.i.update();

		this.history.update();
		this.world.update();
		this.ui.update();

		this.map.update();
		this.lighting.update();
	}
}
 

class MapScene extends Phaser.Scene {
	assets: LoadedAsset[] | null = null;

	i: InputManager = new InputManager(this);
	history: HistoryManager = new HistoryManager(this);
	view: WorldView = new WorldView(this);

	ui: UIView = new UIView(this);
	architect: ArchitectMode = new ArchitectMode(this);
	token: TokenMode = new TokenMode(this);

	size: Vec2 = new Vec2();

	map: MapData = new MapData(this);
	lighting: Lighting = new Lighting(this);

	mode: number = 0;
	tokens: Token[] = [];

	constructor() { 
		super({key: "MapScene"});
	}

	init(assets: LoadedAsset[]): void {
		this.assets = assets;
	}

	preload(): void {
		window.addEventListener('resize', () => {
			let frame = document.getElementById("root")!;
			this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
		});
	}

	create(): void {
		(this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('outline',  new OutlinePipeline(this.game));
		(this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('brighten', new BrightenPipeline(this.game));

		this.i.init();
		this.view.init();

		this.size = new Vec2(64, 64);
		this.map.init(this.size, this.assets!);

		this.ui.init(this.assets!);
		this.architect.init();
		this.token.init();

		this.lighting.init(this.size);
	}

	update(time: number, delta: number): void {
		this.i.update();
		this.history.update();
		this.view.update();

		this.ui.update();

		this.map.update();
		this.lighting.update();

		if (this.i.keyPressed("U")) {
			new AssetUploader(this);
		}
	}
}
 

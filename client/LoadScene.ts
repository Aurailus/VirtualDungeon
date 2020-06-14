class LoadScene extends Phaser.Scene {
	loaderOutline: Phaser.GameObjects.Sprite | null = null;
	loaderFilled: Phaser.GameObjects.Sprite | null = null;

	constructor() {
		super({key: "LoadScene"});
	}

	private setup(): void {
		this.loaderOutline = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_unfilled", 0);
		this.loaderFilled = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_filled", 0);

		this.loaderOutline.setScale(6);
		this.loaderFilled.setScale(6);
		
		this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 140, "logo");

		this.load.on('progress', (val: number) => {
	   	this.loaderFilled!.setCrop(0, this.loaderFilled!.height - this.loaderFilled!.height * val, 
		   	this.loaderFilled!.width, this.loaderFilled!.height * val);
		});
	}

	preload(): void {
		this.setup();

		this.load.image("cursor", "/public/res/cursor.png");
		this.load.image("grid_tile", "/public/res/grid_tile.png");

		this.load.image("ui_button_grid", "/public/res/ui/button_grid.png");
		this.load.spritesheet("ui_button_side_menu", "/public/res/ui/button_side_menu.png", {frameWidth: 21, frameHeight: 18});
		this.load.spritesheet("ui_history_manipulation", "/public/res/ui/history_manipulation.png", {frameWidth: 39, frameHeight: 18});
		this.load.spritesheet("ui_mode_switch", "/public/res/ui/mode_switch.png", {frameWidth: 39, frameHeight: 18});
		this.load.image("ui_quick_selector", "/public/res/ui/quick_selector.png");
		this.load.spritesheet("ui_sidebar_bg", "/public/res/ui/sidebar_bg.png", {frameWidth: 68, frameHeight: 21});
		this.load.image("ui_sidebar_cursor", "/public/res/ui/sidebar_cursor.png");
		this.load.image("ui_sidebar_overlay", "/public/res/ui/sidebar_overlay.png");
		this.load.spritesheet("ui_button_select_cursor", "/public/res/ui/button_select_cursor.png", {frameWidth: 21, frameHeight: 18});
		this.load.spritesheet("ui_background_9x", "/public/res/ui/background_9x.png", {frameWidth: 8, frameHeight: 8});
		this.load.image("ui_sidebar_browse", "/public/res/ui/sidebar_browse.png");
		this.load.spritesheet("ui_button_sidebar_toggle", "/public/res/ui/button_sidebar_toggle.png", {frameWidth: 30, frameHeight: 18});

		this.load.image("shader_light_mask", "/public/res/shader/light_mask.png");

		let assets = JSON.parse(this.cache.text.get("assets"));
		for (let asset of assets) {
			if (asset.size) this.load.spritesheet(asset.identifier, asset.path, {frameWidth: asset.size.x, frameHeight: asset.size.y});
			else this.load.image(asset.identifier, asset.path);
		}
	}

	create(): void {
		this.game.scene.start('MapScene', JSON.parse(this.cache.text.get("assets")));
		this.cache.text.remove("assets");
		this.game.scene.stop('LoadScene');
		this.game.scene.swapPosition('MapScene', 'LoadScene');
	}
}
 

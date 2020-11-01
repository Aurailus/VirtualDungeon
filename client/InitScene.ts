class InitScene extends Phaser.Scene {
	constructor() {
		super({key: "InitScene"});
	}

	preload() {
		this.cameras.main.setBackgroundColor("#090d24");
		this.load.image("logo", "/public/res/loader/logo.png");
		this.load.spritesheet("loader_filled", "/public/res/loader/loader_filled.png", {frameWidth: 18, frameHeight: 18});
		this.load.spritesheet("loader_unfilled", "/public/res/loader/loader_unfilled.png", {frameWidth: 18, frameHeight: 18});

		this.load.text("data", "/data/" + CAMPAIGN_NAME + "/" + MAP_NAME);
		this.load.text("assets", "/assets/" + CAMPAIGN_NAME);
	}

	create(): void {		
		this.game.scene.start('LoadScene');
		this.game.scene.stop('InitScene');
		this.game.scene.swapPosition('LoadScene', 'InitScene');
	}
}
 

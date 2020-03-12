class LoadScene extends Phaser.Scene {
	constructor() {
		super({key: "LoadScene"});
	}

	preload(): void {
		this.cameras.main.setBackgroundColor("#6a655a");

		this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height /2, "splash");

		this.load.bitmapFont('font1x', '/res/font/font1.png', '/res/font/font1.fnt');
		this.load.bitmapFont('font2x', '/res/font/font2.png', '/res/font/font2.fnt');

		for (let s of this.cache.text.get("assets").split("\n")) {
			let tokens = s.split(" ");
			if (tokens.length == 2) this.load.image(tokens[0], "/res/" + tokens[1] + ".png");
			else if (tokens.length == 4) this.load.spritesheet(tokens[0], "/res/" + tokens[1] + ".png", {frameWidth: parseInt(tokens[2]), frameHeight: parseInt(tokens[3])});
		}

		for (let t of TOKENS) {
			if (t.split_by != undefined) this.load.spritesheet(t.key, t.file + ".png", {frameWidth: t.split_by, frameHeight: t.split_by});
			else this.load.image(t.key, t.file + ".png");
		}

		for (let t of WALLS) {
			this.load.spritesheet(t.key, t.file + ".png", {frameWidth: t.res, frameHeight: t.res});
		}

		for (let t of GROUNDS) {
			this.load.spritesheet(t.key, t.file + ".png", {frameWidth: t.res, frameHeight: t.res});
		}
	}

	create(): void {
		this.cache.text.remove("assets");
		
		setTimeout(() => {
			this.game.scene.start('MainScene');
			this.game.scene.stop('LoadScene');
			this.game.scene.swapPosition('MainScene', 'LoadScene');
		}, 50)
	}
}
 

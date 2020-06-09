class InitScene extends Phaser.Scene {
	constructor() {
		super({key: "InitScene"});
	}

	preload(): void {
		this.cameras.main.setBackgroundColor("#090d24");

		this.load.text("assets", "/public/tool/res/_assets.txt");

		this.load.bitmapFont('font1x', '/public/tool/res/font/font1.png', '/public/tool/res/font/font1.fnt');
		this.load.bitmapFont('font2x', '/public/tool/res/font/font2.png', '/public/tool/res/font/font2.fnt');
		
		this.load.image("logo", "/public/tool/res/loader/logo.png");

		this.load.spritesheet("loader_filled", "/public/tool/res/loader/loader_filled.png", {frameWidth: 18, frameHeight: 18});
		this.load.spritesheet("loader_unfilled", "/public/tool/res/loader/loader_unfilled.png", {frameWidth: 18, frameHeight: 18});
	}

	create(): void {
		let assets = this.cache.text.get("assets");
		let lines: string[] = assets.split("\n");

		let assetsParsed = "";
		let prefixes: {[key: string]: string} = {};

		lines.forEach((v: string) => {
			if (v.substr(0, "FOLDERPREFIX".length) == "FOLDERPREFIX") {
				let tokens = v.split(" ");
				prefixes[tokens[1]] = tokens[2];
				return;
			}
			if (v.length == 0) return;

			let slash = v.indexOf('/');

			let prefix = "";
			if (slash != -1 && prefixes[v.substr(0, slash)] != undefined) prefix = prefixes[v.substr(0, slash)];

			if (slash == -1) assetsParsed += `${v.split(" ")[0]} ${v}\n`;
			else assetsParsed += `${prefix}${v.substring(slash + 1, v.length).split(" ")[0]} ${v}\n`;
		});

		this.cache.text.remove("assets");
		this.cache.text.add("assets", assetsParsed);
		
		this.game.scene.start('LoadScene');
		this.game.scene.stop('InitScene');
		this.game.scene.swapPosition('LoadScene', 'InitScene');
	}
}
 

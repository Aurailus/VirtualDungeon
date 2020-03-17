class LoadScene extends Phaser.Scene {
	loaderOutline: Phaser.GameObjects.Sprite;
	loaderFilled: Phaser.GameObjects.Sprite;
	patching: Phaser.GameObjects.Sprite | null = null;

	text: Phaser.GameObjects.BitmapText;

	loadedTween: number = 0;
	preloading: boolean = true;

	spinTimer: number = 0;
	spinFrame: number = 0;

	constructor() {
		super({key: "LoadScene"});
	}

	preload(): void {
		this.cameras.main.setBackgroundColor("#090d24");

		this.loaderOutline = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_unfilled", 0);
		this.loaderOutline.setScale(6);
		this.loaderFilled = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_filled", 0);
		this.loaderFilled.setScale(6);
		
		this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 140, "logo");
		
		this.text = this.add.bitmapText(this.cameras.main.width / 2 - 130, this.cameras.main.height / 2 - 20, "font2x", "Loading Assets...", 22, 1);

		this.load.on('progress', (val) => {
			this.tweens.add({
				targets: this,
				loadedTween: val,
				ease: 'Cubic',
				duration: 150,
				repeat: 0
			});

		});

		this.pre_update();
		this.loadAssets();	
	}

	pre_update() {
		if (!this.preloading) return;

   	this.loaderFilled.setCrop(0, this.loaderFilled.height - this.loaderFilled.height * this.loadedTween, 
	   	this.loaderFilled.width, this.loaderFilled.height * this.loadedTween);

	  this.spinTimer++;
	  if (this.spinTimer > 80 - this.loadedTween * 70) {
	  	this.spinTimer = 0;
	  	this.spinFrame = (this.spinFrame + 1) % 4;
	  	this.loaderOutline.setFrame(this.spinFrame);
	  	this.loaderFilled.setFrame(this.spinFrame);
	  }


		if (this.preloading) setTimeout(this.pre_update.bind(this), 1/60);
	}

	private loadAssets(): void {
		this.load.image("loader_patching", "/res/loader/loader_patching.png");

		for (let s of this.cache.text.get("assets").split("\n")) {
			let tokens = s.split(" ");
			if (tokens.length == 2) this.load.image(tokens[0], "/res/" + tokens[1] + ".png");
			else if (tokens.length == 4) this.load.spritesheet(tokens[0], "/res/" + tokens[1] + ".png", {frameWidth: parseInt(tokens[2]), frameHeight: parseInt(tokens[3])});
		}

		for (let t of TOKENS) {
			if (t.split_by != undefined) this.load.spritesheet(t.key, t.file + ".png", {frameWidth: t.split_by, frameHeight: t.split_by});
			else this.load.image(t.key, t.file + ".png");
		}

		for (let t of WALLS)
			this.load.spritesheet(t.key, t.file + ".png", {frameWidth: t.res, frameHeight: t.res});
		for (let t of GROUNDS)
			this.load.spritesheet(t.key, t.file + ".png", {frameWidth: t.res, frameHeight: t.res});
		for (let t of OVERLAYS)
			this.load.spritesheet(t.key, t.file + ".png", {frameWidth: t.res, frameHeight: t.res});
	}

	create(): void {
		this.preloading = false;

		this.loaderOutline.setFrame(0);
		this.loaderFilled.setFrame(0);

		setTimeout(() => {
	   	this.text.setText("Loading Assets...");
			this.loaderFilled.setCrop(0, 0, 100, 100);

			this.tweens.add({
				targets: [this.loaderOutline, this.loaderFilled],
				y: -400,
				alpha: 0,
				ease: 'Cubic',
				duration: 500,
				repeat: 0
			});

			setTimeout(() => {
				this.patching = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, "loader_patching");
				this.patching.setScale(6);

				this.text.setText(" Patching Tiles...");	
		
				setTimeout(() => {
					this.game.scene.start('MapScene');
					this.game.scene.stop('LoadScene');
					this.game.scene.swapPosition('MapScene', 'LoadScene');
				}, 100);
			}, 300);
		}, 50);

		this.cache.text.remove("assets");
	}
}
 

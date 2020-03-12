class UIView {
	scene: MainScene;
	camera: Phaser.Cameras.Scene2D.Camera;

	o: Phaser.GameObjects.Container;

	visibleMenu: number = 0;
	uiActive: boolean = false;

	tileSidebar: UITileSidebar;
	tokenSidebar: UITokenSidebar;

	constructor(scene: MainScene) {
		this.scene = scene;
		this.camera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, false, "ui_camera");
		this.camera.scrollX = -10000;

		this.o = this.scene.add.container(-10000, 0);
	}

	createElements() {
		this.o.add(new UIModeSwitchButton(this.scene, 14 + 10, 1));
		this.o.add(new UIHistoryManipulation(this.scene, 14 + 25, 1));

		this.tokenSidebar = new UITokenSidebar(this.scene, -205, 0);
		this.o.add(this.tokenSidebar);
		for (let t of TOKENS) {
			this.tokenSidebar.addToken(t.key);
		}

		this.tileSidebar = new UITileSidebar(this.scene, 0, 0);
		this.o.add(this.tileSidebar);

	}

	update() {
		this.uiActive = false;
		for (let o of this.o.list) {
			o.update();
			if (!this.uiActive && (o as UIComponent).mouseIntersects()) this.uiActive = true;
		}

		if (this.visibleMenu != this.scene.mode) {
			this.visibleMenu = this.scene.mode;
			if (this.scene.mode == 0) {
				this.displayArchitect();
				this.hideToken();
			}
			else {
				this.hideArchitect();
				this.displayToken();
			}
		}
	}

	displayArchitect() {
		this.o.bringToTop(this.tileSidebar);
		this.scene.tweens.add({
			targets: this.tileSidebar,
			x: 0,
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
	}

	hideToken() {
		this.scene.tweens.add({
			targets: this.tokenSidebar,
			x: -205,
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
	}

	displayToken() {
		this.o.bringToTop(this.tokenSidebar);
		this.scene.tweens.add({
			targets: this.tokenSidebar,
			x: 0,
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
	}

	hideArchitect() {
		this.scene.tweens.add({
			targets: this.tileSidebar,
			x: -205,
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
	}
}

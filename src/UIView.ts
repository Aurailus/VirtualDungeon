class UIView {
	scene: Phaser.Scene;
	camera: Phaser.Cameras.Scene2D.Camera;

	o: Phaser.GameObjects.Container;

	uiActive: boolean = false;

	constructor(scene) {
		this.scene = scene;
		this.camera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, false, "ui_camera");
		this.camera.scrollX = -10000;

		this.o = this.scene.add.container(-10000, 0);
	}

	update() {
		this.uiActive = false;
		for (let o of this.o.list) {
			o.update();
			if (!this.uiActive && (o as UIComponent).mouseIntersects()) this.uiActive = true;
		}
	}
}

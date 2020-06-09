class UIModeSwitchButton extends UIComponent {
	scene: MapScene;

	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y, "ui_mode_switch");
		this.scene = scene;
		this.setActive(true);
	}

	update() {
		if (this.mouseIntersects()) {
			if (this.scene.mode == 0) {
				if (this.mousePos().x > 19) {
					this.setFrame(2);
					if (this.scene.i.mouseLeftPressed()) this.scene.mode = 1;
				}
				else this.setFrame(1);
			}
			else {
				if (this.mousePos().x <= 19) {
					this.setFrame(3);
					if (this.scene.i.mouseLeftPressed()) this.scene.mode = 0;
				}
				else this.setFrame(0);
			}
		}
		else {
			if (this.scene.mode == 0) this.setFrame(1);
			else this.setFrame(0);
		}
	}
}

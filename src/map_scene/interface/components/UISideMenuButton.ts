class UISideMenuButton extends UIComponent {
	scene: MapScene;

	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y, "ui_button_side_menu");
		this.scene = scene;
		this.setActive(true);
	}

	update() {
		if (this.mouseIntersects()) {
			if (this.scene.input.mousePointer.leftButtonDown()) {
				this.setFrame(2);
			}
			else this.setFrame(1);
		}
		else {
			this.setFrame(0);
		}
	}
}

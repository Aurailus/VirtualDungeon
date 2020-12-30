import UIComponent from './UIComponent';
import type MapScene from '../../scene/MapScene';

export default class UISidebarToggle extends UIComponent {
	scene: MapScene;

	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y, 'ui_button_sidebar_toggle');
		this.scene = scene;
		this.setActive(true);
	}

	update() {
		if (this.mouseIntersects() && this.mousePos().x >= 20) {
			this.setFrame(2 + (this.scene.ui.sidebarOpen ? 0 : 1));
			if (this.scene.i.mouseLeftPressed()) this.scene.ui.toggleSidebarOpen();
		}
		else this.setFrame(0 + (this.scene.ui.sidebarOpen ? 0 : 1));

		if (this.scene.i.keyPressed('F')) this.scene.ui.toggleSidebarOpen();
	}
}

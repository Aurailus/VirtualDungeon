import UIComponent from './UIComponent';
import type MapScene from '../../scene/MapScene';

export default class UISideMenuButton extends UIComponent {
	scene: MapScene;

	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y, 'ui_button_side_menu');
		this.scene = scene;
		this.setActive(true);
	}

	update() {
		if (this.mouseIntersects()) {
			if (this.scene.i.mouseLeftPressed()) {
				this.setFrame(2);
			}
			else this.setFrame(1);
		}
		else {
			this.setFrame(0);
		}
	}
}

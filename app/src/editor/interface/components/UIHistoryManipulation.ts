import UIComponent from './UIComponent';
import type MapScene from '../../scene/MapScene';

export default class UIHistoryManipulation extends UIComponent {
	scene: MapScene;

	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y, 'ui_history_manipulation');
		this.scene = scene;
		this.setActive(true);
	}

	update() {
		let hasNext = this.scene.history.historyHead < this.scene.history.history.length - 1;
		let hasPrev = this.scene.history.historyHead >= 0;

		if (hasNext && hasPrev) {
			if (this.mouseIntersects() && this.mousePos().x > 19) {
				this.setFrame(2);
				if (this.scene.i.mouseLeftPressed()) {
					this.scene.history.redo();
				}
			}
			else if (this.mouseIntersects()) {
				this.setFrame(5);
				if (this.scene.i.mouseLeftPressed()) {
					this.scene.history.undo();
				}
			}
			else this.setFrame(1);
		}
		else if (!hasNext && hasPrev) {
			if (this.mouseIntersects() && this.mousePos().x <= 19) {
				this.setFrame(7);
				if (this.scene.i.mouseLeftPressed()) {
					this.scene.history.undo();
				}
			}
			else this.setFrame(3);
		}
		else if (hasNext && !hasPrev) {
			if (this.mouseIntersects() && this.mousePos().x > 19) {
				this.setFrame(6);
				if (this.scene.i.mouseLeftPressed()) {
					this.scene.history.redo();
				}
			}
			else this.setFrame(0);
		}
		else this.setFrame(4);
	}
}

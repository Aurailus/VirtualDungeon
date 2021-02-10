import type InputManager from './InputManager';

import { Vec2 } from '../util/Vec';
import { clamp } from '../util/Helpers';

/**
 * Handles camera panning and zooming interactions.
 */

export default class CameraControl {
	camera: Phaser.Cameras.Scene2D.Camera | null = null;

	cursorScreen: Vec2 = new Vec2();
	lastCursorScreen: Vec2 = new Vec2();
	cursorWorld: Vec2 = new Vec2();
	lastCursorWorld: Vec2 = new Vec2();

	zoomLevels: number[] = [ 5, 6, 8, 10, 15, 20, 25, 33, 40, 50, 60, 75, 100, 125, 150, 200, 300 ];
	zoomLevel = 9;

	init(camera: Phaser.Cameras.Scene2D.Camera, input: InputManager): void {
		this.camera = camera;

		this.camera.setBackgroundColor(0x090d24);
		this.camera.setZoom(this.zoomLevels[this.zoomLevel]);
		// this.camera.setScroll(-this.camera.width / 2.2, -this.camera.height / 2.2);
		this.camera.setScroll(-this.camera.width / 2, -this.camera.height / 2);

		input.bindScrollEvent((delta: number) => {
			const lastZoom = this.zoomLevels[this.zoomLevel];
			this.zoomLevel = clamp(this.zoomLevel + delta, 0, this.zoomLevels.length - 1);
			const zoom = this.zoomLevels[this.zoomLevel];
			
			camera.scene.tweens.add({
				targets: this.camera,
				zoom: { from: lastZoom, to: zoom },
				ease: 'Cubic',
				duration: 150,
				repeat: 0
			});
		});
	}

	update() {
		this.lastCursorScreen = this.cursorScreen;
		this.lastCursorWorld = this.cursorWorld;

		this.cursorScreen = new Vec2(
			this.camera!.scene.input.mousePointer.x,
			this.camera!.scene.input.mousePointer.y
		);
		
		this.cursorWorld = new Vec2(
			this.cursorScreen.x / this.camera!.zoom + this.camera!.scrollX -
				((this.camera!.displayWidth - this.camera!.width) / 2),
			this.cursorScreen.y / this.camera!.zoom + this.camera!.scrollY -
				((this.camera!.displayHeight - this.camera!.height) / 2)
		);

		if (this.camera!.scene.input.activePointer.middleButtonDown()) {
			this.camera!.scrollX += (this.lastCursorScreen.x - this.cursorScreen.x) / this.camera!.zoom;
			this.camera!.scrollY += (this.lastCursorScreen.y - this.cursorScreen.y) / this.camera!.zoom;
		}
	}

	moveTo(pos: Vec2) {
		this.camera!.scrollX = pos.x;
		this.camera!.scrollY = pos.y;
		this.camera!.zoom = this.zoomLevels[this.zoomLevel];
	}
}

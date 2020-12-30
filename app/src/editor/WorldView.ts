import type MapScene from './scene/MapScene';

import { Vec2 } from './util/Vec';
import { clamp } from './util/Helpers';

export default class WorldView {
	scene: MapScene;
	camera?: Phaser.Cameras.Scene2D.Camera;

	cursorScreen: Vec2 = new Vec2();
	lastCursorScreen: Vec2 = new Vec2();
	cursorWorld: Vec2 = new Vec2();
	lastCursorWorld: Vec2 = new Vec2();

	zoomLevels: number[] = [10, 17, 25, 33, 40, 50, 60, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500];
	zoomLevel = 11;

	constructor(scene: MapScene) {
		this.scene = scene;
	}

	init(): void {
		this.camera = this.scene.cameras.main;
		this.camera.setBackgroundColor('#090d24');

		this.scene.i.bindScrollEvent((delta: number) => {
			if (!this.scene.token.movingTokens && !this.scene.ui.uiActive) {
				this.zoomLevel = clamp(this.zoomLevel + delta, 0, this.zoomLevels.length - 1);
				this.camera!.setZoom(this.zoomLevels[this.zoomLevel] / 100);
			}
		});
	}

	update() {
		this.lastCursorScreen = this.cursorScreen;
		this.lastCursorWorld = this.cursorWorld;

		this.cursorScreen = new Vec2(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);
		this.cursorWorld = new Vec2(
			this.cursorScreen.x / this.camera!.zoom + this.camera!.scrollX -
				((this.camera!.displayWidth - this.camera!.width) / 2),
			this.cursorScreen.y / this.camera!.zoom + this.camera!.scrollY -
				((this.camera!.displayHeight - this.camera!.height) / 2));

		this.pan();
	}

	private pan() {
		if (this.scene.input.activePointer.middleButtonDown()) {
			this.camera!.scrollX += Math.round((this.lastCursorScreen.x - this.cursorScreen.x) / this.camera!.zoom);
			this.camera!.scrollY += Math.round((this.lastCursorScreen.y - this.cursorScreen.y) / this.camera!.zoom);
		}
	}
}

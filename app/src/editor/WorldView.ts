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

	zoomLevels: number[] = [ 5, 6, 8, 10, 15, 20, 25, 33, 40, 50, 60, 75, 100, 125, 150, 200, 300 ];
	zoomLevel = 9;

	constructor(scene: MapScene) {
		this.scene = scene;
	}

	init(): void {
		this.camera = this.scene.cameras.main;
		this.camera.setBackgroundColor('#090d24');
		this.camera.setZoom(this.zoomLevels[this.zoomLevel]);
		this.camera.setScroll(-this.camera.width / 2.2, -this.camera.height / 2.2);

		this.scene.i.bindScrollEvent((delta: number) => {
			if (!this.scene.token.movingTokens && !this.scene.ui.uiActive) {
				
				const lastZoom = this.zoomLevels[this.zoomLevel];
				this.zoomLevel = clamp(this.zoomLevel + delta, 0, this.zoomLevels.length - 1);
				const zoom = this.zoomLevels[this.zoomLevel];
				
				this.scene.tweens.add({
					targets: this.camera,
					zoom: { from: lastZoom, to: zoom },
					ease: 'Cubic',
					duration: 150,
					repeat: 0
				});

				// this.scene.tweens.add({ targets: this.camera!, duration: 150, props: { zoom: this.zoomLevels[this.zoomLevel / 100]}});
				// this.camera!.setZoom(this.zoomLevels[this.zoomLevel] / 100);
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
			this.camera!.scrollX += (this.lastCursorScreen.x - this.cursorScreen.x) / this.camera!.zoom;
			this.camera!.scrollY += (this.lastCursorScreen.y - this.cursorScreen.y) / this.camera!.zoom;
		}
	}
}

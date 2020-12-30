import * as Phaser from 'phaser';

import type MapScene from '../../scene/MapScene';

import { Vec2 } from '../../util/Vec';

export default class UIComponent extends Phaser.GameObjects.Sprite {
	constructor(scene: MapScene, x: number, y: number, tex: string) {
		super(scene, x, y, tex);
		this.setOrigin(0, 0);
		this.setScale(3, 3);
		this.setPos(x * 3, y * 3);
		this.setActive(true);

		this.scene.add.existing(this);
	}

	setPos(x: number, y: number) {
		this.setPosition(x * 3, y * 3);
	}

	mouseIntersects(): boolean {
		let pointer = this.scene.input.mousePointer;
		let xO = ((this.scene as any).ui.sidebarOpen) ? 0 : 204;
		return (pointer.x + xO >= this.x && pointer.y >= this.y &&
			pointer.x + xO <= this.x + this.width * 3 && pointer.y <= this.y + this.height * 3);
	}

	mousePos(): Vec2 {
		let pointer = this.scene.input.mousePointer;
		let xO = ((this.scene as any).ui.sidebarOpen) ? 0 : 204;
		return new Vec2(Math.round((pointer.x + xO - this.x)/3), Math.round((pointer.y - this.y)/3));
	}
}

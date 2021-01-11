import * as Phaser from 'phaser';

import { Vec2, Vec4 } from '../../util/Vec';

export default class Component extends Phaser.GameObjects.Container {
	collision?: Vec4;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
		this.setActive(true);
		this.scene.add.existing(this);
	}

	mouseCollides() {
		if (this.collision) {
			const cursorPos = this.getCursorPos();
			return (cursorPos.x >= this.collision.x && cursorPos.y >= this.collision.y &&
				cursorPos.x <= this.collision.z && cursorPos.y <= this.collision.w);
		}

		return false;
	}

	protected getCursorPos(): Vec2 {
		let pos = new Vec2();
		let parent: Phaser.GameObjects.Container = this;
		while (parent.name !== 'root') {
			pos = new Vec2(pos.x + parent.x, pos.y + parent.y);
			parent = parent.parentContainer;
		}

		const cursor = new Vec2(this.scene.input.mousePointer.x / 3, this.scene.input.mousePointer.y / 3).floor();
		const res = new Vec2(cursor.x - pos.x, cursor.y - pos.y);

		return res;
	}
}

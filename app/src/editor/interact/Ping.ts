import * as Phaser from 'phaser';

import { Vec2, Vec4 } from '../util/Vec';

const PAD = new Vec4(220, 32, 32, 48);

export default class Ping extends Phaser.GameObjects.Container {
	private start: number = Date.now();
	
	private rings: Phaser.GameObjects.Ellipse[] = [];
	private arrow: Phaser.GameObjects.Polygon;

	constructor(scene: Phaser.Scene, private pos: Vec2, tint: number) {
		super(scene, 0, 0);
		this.scene.add.existing(this);

		for (let i = 0; i < 3; i++) {
			const ring = this.scene.add.ellipse(pos.x, pos.y, 1, 1, tint, 1);
			ring.setAlpha(0);
			ring.setData('offset', 200 - i * 300);

			this.add(ring);
			this.rings.push(ring);
		}

		this.arrow = this.scene.add.polygon(0, 0, [ new Vec2(.17, .5), new Vec2(.17, 0), new Vec2(.5, 0),
			new Vec2(0, -.5), new Vec2(-.5, 0), new Vec2(-.17, 0), new Vec2(-.17, .5)], tint);
		this.arrow.setVisible(false);
		this.arrow.setOrigin(0);

		this.add(this.arrow);
	}

	update() {
		const delta = Date.now() - this.start;

		this.rings.forEach(r => {
			const offset = r.getData('offset');
			const time = delta + offset;
			if (time < 0) return;
			const size = Math.pow(time, 2) / 100000;
			const opacity = Math.max(1 - ((time - 100) / 600), 0);
			
			r.setScale(size);
			r.setAlpha(opacity);
		});

		const camera = this.scene.cameras.main;
		const center = new Vec2(camera.scrollX + camera.width / 2, camera.scrollY + camera.height / 2);
		const bounds = new Vec4(
			center.x - camera.displayWidth  / 2 + PAD.x / camera.zoom,
			center.y - camera.displayHeight / 2 + PAD.y / camera.zoom,
			center.x + camera.displayWidth  / 2 - PAD.z / camera.zoom,
			center.y + camera.displayHeight / 2 - PAD.w / camera.zoom);

		const diff = new Vec2(this.pos.x - center.x, this.pos.y - center.y).normalize();
		const angle = Math.atan2(diff.y, diff.x);

		const offscreen = this.pos.x < bounds.x || this.pos.y < bounds.y || this.pos.x > bounds.z || this.pos.y > bounds.w;
		this.arrow.setVisible(offscreen);
		this.arrow.setRotation(angle + Math.PI / 2);
		this.arrow.setScale(48 / camera.zoom);
		this.arrow.setPosition(center.x + diff.x * 16, center.y + diff.y * 16);
	}

	shouldDie(): boolean {
		return Date.now() - this.start > 2000;
	}
}

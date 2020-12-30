import type Lighting from './Lighting';

import Layer from '../util/Layer';
import { Vec2 } from '../util/Vec';

export default class LightSource {
	light: Lighting;

	x: number;
	y: number;
	radius: number = 32;
	intensity: number = 1.0;

	constructor(light: Lighting, x: number, y: number) {
		this.light = light;
		this.x = x;
		this.y = y;
	}

	setRadius(radius: number) {
		this.radius = radius;
	}

	setIntensity(intensity: number) {
		this.intensity = intensity;
	}

	createGfx(): Phaser.GameObjects.RenderTexture {
		console.log('rendering gfx');
		
		let start = new Vec2(Math.floor(this.x / 16), Math.floor(this.y / 16));
		let points: Vec2[] = [];

		for (let i = 0; i < 288; i++) {
			let ray = new Vec2(0.5, 0.5);
			let dir = new Vec2(Math.cos(i * 1.25 * (Math.PI / 180)) / 32, Math.sin(i * 1.25 * (Math.PI / 180)) / 32);

			let dist = 0;
			while (this.light.scene.map.getTileset(Layer.wall, Math.floor(start.x + ray.x), Math.floor(start.y + ray.y)) === -1 &&
				(dist = Math.sqrt(Math.pow(ray.x, 2) + Math.pow(ray.y, 2))) < this.radius / 16) {

				ray.x += dir.x;
				ray.y += dir.y;
			}

			ray.x += dir.x * 0.3;
			ray.y += dir.y * 0.3;
			ray.x += dir.x * ((this.radius / 16) - dist) * 0.5;
			ray.y += dir.y * ((this.radius / 16) - dist) * 0.5;

			points.push(new Vec2(ray.x * 4, ray.y * 4));
		}

		let render = new Phaser.GameObjects.RenderTexture(this.light.scene, 0, 0, this.radius * 2, this.radius * 2);

		let gfx = new Phaser.GameObjects.Graphics(this.light.scene, {x: this.radius, y: this.radius});
		gfx.setScale(4, 4);
		gfx.fillStyle(0xffffff, this.intensity / 3);
		gfx.fillPoints(points, true);
		gfx.setAlpha(0.5);
		
		for (let i = 0; i < 6; i++) {
			gfx.scaleX += 0.02;
			gfx.scaleY += 0.02;
			render.draw(gfx);
		}

		let spr = new Phaser.GameObjects.Sprite(this.light.scene, 0, 0, 'shader_light_mask');
		spr.setScale(this.radius / 128, this.radius / 128);
		spr.setOrigin(0, 0);
		spr.setBlendMode(Phaser.BlendModes.ERASE);
		render.draw(spr);

		spr.destroy();
		gfx.destroy();

		render.setBlendMode(Phaser.BlendModes.ERASE);
		return render;
	}
}

import * as Phaser from 'phaser';

import Map from '../Map';

import { CHUNK_RESOLUTION } from './LightChunk';

import { Vec2 } from '../../util/Vec';

const TRACE_POINTS = 360;
const TRACE_STEP = 0.05;

export default class LightSource {

	private canvas = document.createElement('canvas');

	constructor(private scene: Phaser.Scene, private map: Map,
		public pos: Vec2, public radius: number, public intensity: number) {
		this.setRadius(radius);
		this.rebuildCanvas();
	}

	setRadius(radius: number) {
		this.radius = radius;
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.radius * CHUNK_RESOLUTION * 2;
		this.canvas.height = this.radius * CHUNK_RESOLUTION * 2;
	}

	setIntensity(intensity: number) {
		this.intensity = intensity;
	}

	rebuildCanvas() {
		let points: Vec2[] = [];
		for (let i = 0; i < TRACE_POINTS; i++) {
			const angle = i * (360 / TRACE_POINTS) * (Math.PI / 180);
			const dir = new Vec2(Math.cos(angle) * TRACE_STEP, Math.sin(angle) * TRACE_STEP);

			let ray = new Vec2(0, 0);
			
			while (ray.length() < this.radius && this.map.getActiveLayer()!.getTile(
				'wall', new Vec2(this.pos.x + ray.x + 0.5, this.pos.y + ray.y + 0.5).floor()) === 0) {
				ray.x += dir.x;
				ray.y += dir.y;
			}

			points.push(ray);
		}

		const ctx = this.canvas.getContext('2d')!;

		ctx.globalAlpha = this.intensity;
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle = '#000000';
		ctx.beginPath();
		ctx.moveTo((this.radius + points[0].x) * CHUNK_RESOLUTION, (this.radius + points[0].y) * CHUNK_RESOLUTION);
		for (let i = 1; i < points.length; i++)
			ctx.lineTo((this.radius + points[i].x) * CHUNK_RESOLUTION, (this.radius + points[i].y) * CHUNK_RESOLUTION);
		ctx.closePath();
		ctx.fill();

		ctx.globalCompositeOperation = 'destination-in';
		const tex = this.scene.textures.get('shader_light_mask');
		const img = tex.source[0].image;
		ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
		ctx.globalCompositeOperation = 'source-over';
		ctx.globalAlpha = 1;
	}

	getCanvas(): HTMLCanvasElement {
		return this.canvas;
	}
}

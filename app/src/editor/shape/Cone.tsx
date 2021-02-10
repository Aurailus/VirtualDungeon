import * as Phaser from 'phaser';

import Shape, { ShapeIntersect, HANDLE_SIZE } from './Shape';

import { Vec2 } from '../util/Vec';
import { clamp } from '../util/Helpers';

export interface SerializedCone {
	origin: { x: number; y: number };
	end: { x: number; y: number };
	tint: number;
}

const UNFOCUSED_FILL_ALPHA = 0.05;
const FOCUSED_FILL_ALPHA = 0.15;
const UNFOCUSED_STROKE_ALPHA = 0.6;
const FOCUSED_STROKE_ALPHA = 1;

const ANGLE_ROUND_FACTOR = (Math.PI / 12);

export default class Cone extends Shape {
	readonly type = 'cone';

	private end: Vec2;

	private lockDistance: boolean = false;
	private roundProperties: boolean = false;

	private midLine: Phaser.GameObjects.Line;
	private triangle: Phaser.GameObjects.Polygon;
	
	private indicator: Phaser.GameObjects.Text;
	private moveHandle: Phaser.GameObjects.Ellipse;
	private scaleHandle: Phaser.GameObjects.Ellipse;

	constructor(scene: Phaser.Scene, protected origin: Vec2, uuid?: string) {
		super(scene, origin, uuid);
		this.end = origin;

		this.midLine = this.scene.add.line();
		this.triangle = this.scene.add.polygon(0, 0, [ new Vec2(0, 0) ]);

		this.indicator = this.scene.add.text(0, 0, '',
			{ fontFamily: 'sans-serif', fontSize: '32px', align: 'center' });
		this.moveHandle = this.scene.add.ellipse(0, 0, HANDLE_SIZE * 2, HANDLE_SIZE * 2, 0xffffff);
		this.scaleHandle = this.scene.add.ellipse(0, 0, HANDLE_SIZE * 2, HANDLE_SIZE * 2, 0xffffff);

		this.add(this.midLine);
		this.add(this.triangle);

		this.add(this.indicator);
		this.add(this.moveHandle);
		this.add(this.scaleHandle);

		this.indicator.setVisible(false);
		this.moveHandle.setScale(.65);
		this.moveHandle.setAlpha(.5);
	}

	serialize() {
		const data: SerializedCone = {
			origin: this.origin,
			end: this.end,
			tint: this.tint
		};

		return JSON.stringify(data);
	}

	deserialize(d: string) {
		const data = JSON.parse(d) as SerializedCone;
		this.setOrigin(new Vec2(data.origin));
		this.setEnd(new Vec2(data.end));
		this.setTint(data.tint);
	}

	setOrigin(origin: Vec2) {
		if (this.origin.equals(origin)) return;
		const offset = new Vec2(origin.x - this.origin.x, origin.y - this.origin.y);
		this.end = new Vec2(this.end.x + offset.x, this.end.y + offset.y);
		this.origin = origin;

		this.dirty = true;
		this.updatePrimitives();
	}

	setEnd(end: Vec2) {
		if (this.end.equals(end)) return;

		let diff = new Vec2(end.x - this.origin.x, end.y - this.origin.y);

		let len = this.roundProperties ? Math.round(diff.length()) : diff.length();
		if (this.lockDistance) len = new Vec2(this.end.x - this.origin.x, this.end.y - this.origin.y).length();
		
		let angle = Math.atan2(diff.y, diff.x);
		if (this.roundProperties) angle = Math.round(angle / ANGLE_ROUND_FACTOR) * ANGLE_ROUND_FACTOR;
		this.end = end;

		let dir = new Vec2(Math.cos(angle), Math.sin(angle));
		this.end = new Vec2(this.origin.x + dir.x * len, this.origin.y + dir.y * len);

		this.dirty = true;
		this.updatePrimitives();
	}

	setTint(tint: number = 0xffffff) {
		if (tint === this.tint) return;
		this.tint = tint;
		this.dirty = true;
		this.updatePrimitives();
	}

	getLength(): number {
		return new Vec2(this.end.x - this.origin.x, this.end.y - this.origin.y).length();
	}

	setRounded(roundProperties?: boolean) {
		this.roundProperties = roundProperties ?? !this.roundProperties;
	}

	setDistanceLocked(lockDistance?: boolean) {
		this.lockDistance = lockDistance ?? !this.lockDistance;
	}

	updateInteractions(cursorPos: Vec2): ShapeIntersect {
		const shapeIntersects = this.intersectsShape(cursorPos) as boolean;
		const moveHandleIntersects = this.intersectsHandle(cursorPos, this.origin);
		const scaleHandleIntersects = this.intersectsHandle(cursorPos, this.end);

		const intersects = shapeIntersects || moveHandleIntersects || scaleHandleIntersects;

		this.showHandles(intersects);
		this.showHighlight(intersects, true);

		this.moveHandle.setScale(moveHandleIntersects ? 1 : .65);
		this.moveHandle.setAlpha(moveHandleIntersects ? 1 : .5);
		this.scaleHandle.setScale(scaleHandleIntersects ? 1 : .65);
		this.scaleHandle.setAlpha(scaleHandleIntersects ? 1 : .5);

		return moveHandleIntersects ? 'move' :
			scaleHandleIntersects ? 'scale' :
				shapeIntersects ? 'shape' :
					false;
	}

	protected intersectsShape(pos: Vec2, epsilon: number = .01): boolean {
		const diff = new Vec2(this.end.x - this.origin.x, this.end.y - this.origin.y);
		const dir = diff.normalize();
		const len = diff.length();

		const end1 = new Phaser.Math.Vector2(dir.x, dir.y).rotate(Math.PI / 2).scale(len / 2).add(this.end as any);
		const end2 = new Phaser.Math.Vector2(dir.x, dir.y).rotate(-Math.PI / 2).scale(len / 2).add(this.end as any);

		const circle = new Phaser.Geom.Circle(pos.x, pos.y, epsilon);
		const triangle = new Phaser.Geom.Triangle(this.origin.x, this.origin.y, end1.x, end1.y, end2.x, end2.y);
		const intersects = Phaser.Geom.Intersects.TriangleToCircle(triangle, circle);

		return intersects;
	}

	protected updatePrimitives() {
		const diff = new Vec2(this.end.x - this.origin.x, this.end.y - this.origin.y);
		const angle = Math.atan2(diff.y, diff.x);
		const dir = diff.normalize();
		const len = diff.length();

		const end1 = new Phaser.Math.Vector2(dir.x, dir.y).rotate(Math.PI / 2).scale(len / 2).add(this.end as any);
		const end2 = new Phaser.Math.Vector2(dir.x, dir.y).rotate(-Math.PI / 2).scale(len / 2).add(this.end as any);

		this.triangle.destroy();
		this.triangle = this.scene.add.polygon(0, 0, [ this.origin, end1, end2 ], this.tint,
			this.showingHighlight ? FOCUSED_FILL_ALPHA : UNFOCUSED_FILL_ALPHA);
		this.triangle.setStrokeStyle(.06, this.tint, this.showingHighlight ? FOCUSED_STROKE_ALPHA : UNFOCUSED_STROKE_ALPHA);
		this.triangle.setOrigin(0);
		this.add(this.triangle);
		this.moveTo(this.triangle, 0);

		this.midLine.setTo(this.origin.x, this.origin.y, this.end.x, this.end.y);
		this.midLine.setStrokeStyle(.03, this.tint, (this.showingHighlight ? FOCUSED_STROKE_ALPHA : UNFOCUSED_STROKE_ALPHA) / 3);
		this.midLine.setLineWidth(.03);
		this.midLine.setOrigin(0);

		this.indicator.setText(`${Math.round(len * 50) / 10}ft\n${Math.round(angle * (180 / Math.PI))}°`);
		this.indicator.setPosition(this.origin.x + diff.x / 1.55 - this.indicator.displayWidth / 2,
			this.origin.y + diff.y / 1.55 - this.indicator.displayHeight / 2);
		this.indicator.setOrigin(0);
		this.indicator.setVisible(len >= 1.99 && this.showingIndicators);
		this.indicator.setScale((1 / 64) * clamp((len + 1.5) * 0.2, 0.8, 1.3));

		this.moveHandle.setPosition(this.origin.x, this.origin.y);
		this.moveHandle.setVisible(this.showingHandles);
		this.scaleHandle.setPosition(this.end.x, this.end.y);
		this.scaleHandle.setVisible(this.showingHandles);
	}
}

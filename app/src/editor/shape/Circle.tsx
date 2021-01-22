import * as Phaser from 'phaser';

import Shape, { ShapeIntersect, HANDLE_SIZE } from './Shape';

import { Vec2 } from '../util/Vec';
import { clamp } from '../util/Helpers';

const UNFOCUSED_FILL_ALPHA = 0.05;
const FOCUSED_FILL_ALPHA = 0.15;
const UNFOCUSED_STROKE_ALPHA = 0.6;
const FOCUSED_STROKE_ALPHA = 1;

export default class Circle extends Shape {
	readonly type = 'circle';

	private end: Vec2 = new Vec2(0);

	private intersects: boolean = false;

	private roundProperties: boolean = false;

	private midLine: Phaser.GameObjects.Line;
	private circle: Phaser.GameObjects.Ellipse;

	private indicator: Phaser.GameObjects.Text;
	private moveHandle: Phaser.GameObjects.Ellipse;
	private scaleHandle: Phaser.GameObjects.Ellipse;

	constructor(scene: Phaser.Scene, protected origin: Vec2) {
		super(scene, origin);

		this.midLine = this.scene.add.line();
		this.circle = this.scene.add.ellipse(this.origin.x, this.origin.y);

		this.indicator = this.scene.add.text(this.origin.x, this.origin.y, '',
			{ fontFamily: 'monospace', fontSize: '32px', align: 'center' });
		this.moveHandle = this.scene.add.ellipse(0, 0, HANDLE_SIZE * 2, HANDLE_SIZE * 2, 0xffffff);
		this.scaleHandle = this.scene.add.ellipse(0, 0, HANDLE_SIZE * 2, HANDLE_SIZE * 2, 0xffffff);

		this.add(this.circle);
		this.add(this.midLine);

		this.add(this.indicator);
		this.add(this.moveHandle);
		this.add(this.scaleHandle);

		this.midLine.setVisible(false);
		this.indicator.setVisible(false);
		this.moveHandle.setScale(.65);
		this.moveHandle.setAlpha(.5);
	}

	setOrigin(origin: Vec2) {
		if (this.origin.equals(origin)) return;
		const offset = new Vec2(origin.x - this.origin.x, origin.y - this.origin.y);
		this.end = new Vec2(this.end.x + offset.x, this.end.y + offset.y);
		this.origin = origin;

		this.updatePrimitives();
	}

	setEnd(end: Vec2) {
		if (this.end.equals(end)) return;

		const diff = new Vec2(end.x - this.origin.x, end.y - this.origin.y);
		const dir = diff.normalize();
		let radius = diff.length();
		if (this.roundProperties) radius = Math.round(radius * 2) / 2;

		this.end = new Vec2(this.origin.x + dir.x * radius, this.origin.y + dir.y * radius);

		this.updatePrimitives();
	}

	getRadius(): number {
		return new Vec2(this.end.x - this.origin.x, this.end.y - this.origin.y).length();
	}

	setRounded(roundProperties?: boolean) {
		this.roundProperties = roundProperties ?? !this.roundProperties;
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

	protected intersectsShape(cursorPos: Vec2, epsilon: number = .01): boolean {
		const a = new Phaser.Geom.Circle(cursorPos.x, cursorPos.y, epsilon);
		const b = new Phaser.Geom.Circle(this.origin.x, this.origin.y, (this.circle.geom as any).width / 2);
		const intersects = Phaser.Geom.Intersects.CircleToCircle(a, b);

		if (this.intersects !== intersects) {
			this.intersects = intersects;
			this.updatePrimitives();
		}

		return intersects;
	}

	protected updatePrimitives() {
		const diff = new Vec2(this.end.x - this.origin.x, this.end.y - this.origin.y);
		let radius = diff.length();

		const fill = this.intersects || this.showingHighlight ? FOCUSED_FILL_ALPHA : UNFOCUSED_FILL_ALPHA;
		const stroke = this.intersects || this.showingHighlight ? FOCUSED_STROKE_ALPHA : UNFOCUSED_STROKE_ALPHA;

		this.circle.setSize(radius * 2, radius * 2);
		this.circle.setOrigin(0.5);
		this.circle.setPosition(this.origin.x, this.origin.y);
		this.circle.setStrokeStyle(.06, this.tint, stroke);
		this.circle.setFillStyle(this.tint, fill);

		this.midLine.setTo(this.origin.x, this.origin.y, this.end.x, this.end.y);
		this.midLine.setStrokeStyle(.03, this.tint, stroke / 3);
		this.midLine.setLineWidth(.03);
		this.midLine.setOrigin(0);

		this.midLine.setVisible(this.showingHandles);

		this.indicator.setText(Math.round(radius * 50) / 10 + 'ft');
		this.indicator.setVisible(radius >= .98 && this.showingIndicators);
		this.indicator.setScale((1 / 64) * clamp((radius * 2 + 1.7) * 0.2, 0.8, 1.3));
		this.indicator.setPosition(this.origin.x + diff.x / 2 - this.indicator.displayWidth / 2,
			this.origin.y + diff.y / 2 - this.indicator.displayHeight / 2);

		this.moveHandle.setPosition(this.origin.x, this.origin.y);
		this.moveHandle.setVisible(this.showingHandles);
		this.scaleHandle.setPosition(this.end.x, this.end.y);
		this.scaleHandle.setVisible(this.showingHandles);
	}
}

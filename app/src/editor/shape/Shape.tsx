import * as Phaser from 'phaser';

import Token from '../map/token/Token';

import { Vec2 } from '../util/Vec';

export type ShapeIntersect = 'shape' | 'move' | 'scale' | false;

export const HANDLE_SIZE = .25;

export default abstract class Shape extends Phaser.GameObjects.Container {
	protected tint: number = 0xffffff;

	protected showingHandles: boolean = false;
	protected showingHighlight: boolean = false;
	protected showingIndicators: boolean = false;

	protected attachedToken?: Token;
	protected attachedChangeEvent?: () => void;
	protected attachedDestroyEvent?: () => void;

	constructor(scene: Phaser.Scene, protected origin: Vec2) {
		super(scene, 0, 0);

		this.on('destroy', () => this.detachFromToken());
	}

	setOrigin(origin: Vec2) {
		if (this.origin.equals(origin)) return;
		this.origin = origin;
		this.updatePrimitives();
	}

	getOrigin(): Vec2 {
		return new Vec2(this.origin);
	}

	setTint(tint: number = 0xffffff) {
		if (tint === this.tint) return;
		this.tint = tint;
		this.updatePrimitives();
	}

	showHandles(show?: boolean) {
		if (this.showingHandles === show) return;
		this.showingHandles = show ?? !this.showingHandles;
		this.updatePrimitives();
	}

	showIndicators(show?: boolean) {
		if (this.showingIndicators === show) return;
		this.showingIndicators = show ?? !this.showingIndicators;
		this.updatePrimitives();
	}

	showHighlight(show?: boolean, forceUpdateAttached?: boolean) {
		show = show ?? !this.showingHighlight;
		if (this.showingHighlight !== show || (forceUpdateAttached && show)) this.attachedToken?.setSelected(show);
		if (this.showingHighlight === show) return;
		this.showingHighlight = show;
		this.updatePrimitives();
	}

	attachToToken(token: Token) {
		this.detachFromToken();

		const tokenPos = new Vec2(token.x, token.y);
		const offset = new Vec2(this.origin.x - tokenPos.x, this.origin.y - tokenPos.y);

		this.attachedToken = token;
		this.attachedChangeEvent = () => this.setOrigin(new Vec2(token.x + offset.x, token.y + offset.y));
		token.on_render.bind(this.attachedChangeEvent);

		this.attachedDestroyEvent = () => this.detachFromToken();
		token.on('destroy', this.attachedDestroyEvent);
	}

	detachFromToken() {
		if (!this.attachedToken) return;
		this.attachedToken.setSelected(false);
		this.attachedToken.on_render.unbind(this.attachedChangeEvent!);
		this.attachedChangeEvent = undefined;
		this.attachedToken.off('destroy', this.attachedDestroyEvent!);
		this.attachedDestroyEvent = undefined;
		this.attachedToken = undefined;
	}

	protected intersectsHandle(pos: Vec2, handlePos: Vec2, epsilon: number = .01): boolean {
		const cursor = new Phaser.Geom.Circle(pos.x, pos.y, epsilon);
		const handle = new Phaser.Geom.Circle(handlePos.x, handlePos.y, HANDLE_SIZE);
		return Phaser.Geom.Intersects.CircleToCircle(cursor, handle);
	}

	protected abstract intersectsShape(cursorPos: Vec2, epsilon: number): boolean;

	protected abstract updateInteractions(cursorPos: Vec2): ShapeIntersect;

	protected abstract updatePrimitives(): void;
}

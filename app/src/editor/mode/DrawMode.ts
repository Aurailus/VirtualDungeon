import * as Phaser from 'phaser';

import Mode from './Mode';
import Map from '../map/Map';
import Shape from '../shape/Shape';
import Token from '../map/token/Token';
import InputManager from '../InputManager';
import EventHandler from '../EventHandler';
import ActionManager from '../action/ActionManager';

import Cone from '../shape/Cone';
import Circle from '../shape/Circle';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';

export const DrawModeKey = 'DRAW';

export type DrawModeTool = 'line' | 'tile' | 'circle' | 'cone';

export interface DrawModeEvent {
	currentTool: DrawModeTool;
};

// const PLAYER_TINT = 0xffee99;
const PLAYER_TINT = 0x99ffee;

export default class DrawMode extends Mode {
	private drawTool: DrawModeTool = 'circle';

	private current?: Cone | Circle;
	private editContext: 'move' | 'scale' = 'scale';

	private drawings: Set<Cone | Circle> = new Set();
	private drawingRoot: Phaser.GameObjects.Container;

	private evtHandler = new EventHandler<DrawModeEvent>();

	constructor(scene: Phaser.Scene, map: Map, actions: ActionManager, assets: Asset[]) {
		super(scene, map, actions, assets);

		this.drawingRoot = this.scene.add.container(0, 0);
		this.drawingRoot.setDepth(10000);
	}

	update(cursorPos: Vec2, input: InputManager) {

		// Update and select active shape.

		if (!this.current) {
			for (let d of this.drawings.values()) {
				const interact = d.updateInteractions(cursorPos);
				if (interact) {
					if (input.mouseRightDown()) {
						this.drawings.delete(d);
						d.destroy();
					}
					else if (input.mouseLeftPressed()) {
						if (interact === 'scale' || interact === 'move') {
							this.current = d;
							// this.current.updateInteractions(cursorPos);
							this.editContext = interact;
						}
					}
				}
			}
		}

		// Edit or create current shape.

		switch (this.current?.type ?? this.drawTool) {
		default: break;
		case 'circle':
			this.handleCircle(cursorPos, input);
			break;

		case 'line':
			this.handleLine(cursorPos, input);
			break;

		case 'cone':
			this.handleCone(cursorPos, input);
		}

		// Commit or destroy active shape.

		if (this.current) {
			if (input.keyPressed('SPACE')) {
				this.current.setTint(PLAYER_TINT);
				this.drawings.add(this.current);
			}

			if (input.mouseLeftReleased()) {
				this.current.showIndicators(false);
				if (!this.drawings.has(this.current)) this.current.destroy();
				this.current = undefined;
			}
		}
	}

	getTool(): DrawModeTool {
		return this.drawTool;
	}

	setTool(tool: DrawModeTool) {
		this.drawTool = tool;
		this.evtHandler.dispatch({ currentTool: tool });
	}

	activate() { /* No activation logic */ }

	deactivate() {
		if (this.current && !this.drawings.has(this.current)) this.current.destroy();
		this.current = undefined;

		this.drawings.forEach(d => {
			d.showHandles(false);
			d.showHighlight(false);
			d.showIndicators(false);
		});
	}

	bind(cb: (evt: DrawModeEvent) => boolean | void) {
		this.evtHandler.bind(cb);
	}

	unbind(cb: (evt: DrawModeEvent) => boolean | void) {
		this.evtHandler.unbind(cb);
	}

	private handleCircle(cursorPos: Vec2, input: InputManager) {
		if (input.mouseLeftPressed() && !this.current) {
			if (!input.keyDown('ALT')) cursorPos = new Vec2(Math.floor(cursorPos.x) + 0.5, Math.floor(cursorPos.y) + 0.5);
			const circle = new Circle(this.scene, cursorPos);
			const token = this.findPotentialAttach(circle, cursorPos, true);
			if (token) circle.attachToToken(token);
			this.drawingRoot.add(circle);
			this.editContext = 'scale';
			this.current = circle;
		}

		if (!this.current) return;
		const circle = this.current as Circle;

		circle.showIndicators(true);
		circle.showHandles(true);

		if (input.mouseLeftDown()) {
			if (this.editContext === 'scale') {
				circle.setEnd(cursorPos);
				circle.setRounded(!input.keyDown('ALT'));
			}
			else {
				if (!input.keyDown('ALT')) {
					circle.detachFromToken();
					cursorPos = new Vec2(Math.floor(cursorPos.x) + 0.5, Math.floor(cursorPos.y) + 0.5);
					this.findPotentialAttach(circle, cursorPos, true);
				}
				circle.setOrigin(cursorPos);
			}
		}

		if (input.mouseLeftReleased() && this.editContext === 'move') {
			if (!this.drawings.has(this.current)) return;
			const token = this.findPotentialAttach(circle, cursorPos);
			if (token) circle.attachToToken(token);
		}
	}

	private findPotentialAttach(shape: Shape, cursorPos: Vec2, highlight?: boolean): Token | undefined {
		shape.detachFromToken();
		const tilePos = cursorPos.floor();

		let found: Token | undefined = undefined;
		this.map.tokens.getTokens().forEach(t => {
			const isFound = t.x === tilePos.x && t.y === tilePos.y;
			t.setSelected(!!(isFound && highlight));
			if (isFound) found = t;
		});

		return found;
	}

	private handleLine(_cursorPos: Vec2, _input: InputManager) {
		// if (input.mouseLeftPressed()) {
		// 	if (!this.clickPoints) this.clickPoints = [];
		// 	this.clickPoints.push(cursorPos);
		// 	this.primitives.forEach(p => p.destroy());
		// 	const poly = this.scene.add.polygon(0, 0, this.clickPoints);
		// 	poly.setStrokeStyle(.06, 0xffffff, 1);
		// 	poly.setOrigin(0);
		// 	poly.setClosePath(false);
		// 	this.primitives = [ poly ];
		// }

		// if (input.mouseRightPressed()) {
		// 	this.clickPoints = undefined;
		// 	this.primitives.forEach(p => p.destroy());
		// 	this.primitives = [];
		// }

		// if (this.clickPoints) {
		// 	if (this.primitives[1]) this.primitives[1].destroy();
		// 	const endPos = this.clickPoints[this.clickPoints.length - 1];
		// 	const line = this.scene.add.line(0, 0, endPos.x, endPos.y, cursorPos.x, cursorPos.y, 0xffffff);
		// 	line.setLineWidth(.03);
		// 	line.setOrigin(0);
		// 	this.primitives[1] = line;
		// }
	}

	private handleCone(cursorPos: Vec2, input: InputManager) {
		if (input.mouseLeftPressed() && !this.current) {
			if (!input.keyDown('ALT')) cursorPos = new Vec2(Math.floor(cursorPos.x) + 0.5, Math.floor(cursorPos.y) + 0.5);
			const cone = new Cone(this.scene, cursorPos);
			const token = this.findPotentialAttach(cone, cursorPos, true);
			if (token) cone.attachToToken(token);
			this.drawingRoot.add(cone);
			this.editContext = 'scale';
			this.current = cone;
		}

		if (!this.current) return;
		const cone = this.current as Cone;

		cone.showIndicators(true);
		cone.showHandles(true);

		if (input.mouseLeftDown()) {
			if (this.editContext === 'scale') {
				cone.setEnd(cursorPos);
				cone.setRounded(!input.keyDown('ALT'));
				if (input.mouseRightPressed()) cone.setDistanceLocked();
			}
			else {
				if (!input.keyDown('ALT')) {
					cone.detachFromToken();
					cursorPos = new Vec2(Math.floor(cursorPos.x) + 0.5, Math.floor(cursorPos.y) + 0.5);
					this.findPotentialAttach(cone, cursorPos, true);
				}
				cone.setOrigin(cursorPos);
			}
		}

		if (input.mouseLeftReleased() && this.editContext === 'move') {
			if (!this.drawings.has(this.current)) return;
			const token = this.findPotentialAttach(cone, cursorPos);
			if (token) cone.attachToToken(token);
		}
	}
}

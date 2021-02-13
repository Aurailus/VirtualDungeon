import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import Mode from './Mode';
import GameMap from '../map/Map';
import Shape from '../shape/Shape';
import Token from '../map/token/Token';
import EventHandler from '../EventHandler';
import InputManager from '../interact/InputManager';
import ActionManager from '../action/ActionManager';
import ArchitectController from '../interact/ArchitectController';

import Cone from '../shape/Cone';
import Circle from '../shape/Circle';

import { Vec2 } from '../util/Vec';
import * as Color from '../../../../common/Color';
import { Asset } from '../../../../common/DBStructs';

export const DrawModeKey = 'DRAW';

export type DrawModeTool = 'line' | 'tile' | 'circle' | 'cone';

export interface DrawModeToolEvent {
	currentTool: DrawModeTool;
};

export interface DrawModeColorEvent {
	currentColor: Color.HSV;
}

export default class DrawMode extends Mode {
	readonly tool = new EventHandler<DrawModeToolEvent>();
	readonly color = new EventHandler<DrawModeColorEvent>();

	private drawTool: DrawModeTool = 'tile';

	private current?: Cone | Circle;
	private editContext: 'move' | 'scale' = 'scale';

	private ownedDrawings: Map<string, Cone | Circle> = new Map();
	private otherDrawings: Map<string, Cone | Circle> = new Map();
	private drawingRoot: Phaser.GameObjects.Container;
	
	private controller: ArchitectController;

	constructor(scene: Phaser.Scene, map: GameMap, socket: IO.Socket, actions: ActionManager, assets: Asset[]) {
		super(scene, map, socket, actions, assets);

		this.controller = new ArchitectController(scene, actions);

		this.drawingRoot = this.scene.add.container(0, 0);
		this.drawingRoot.setDepth(10000);

		this.socket.on('update_drawing', (uuid: string, type: string, data: string) => {
			let drawing = this.otherDrawings.get(uuid);
			if (!drawing) {
				if (type === 'cone') drawing = new Cone(this.scene, new Vec2(), type);
				else if (type === 'circle') drawing = new Circle(this.scene, new Vec2(), type);
				else return;

				this.drawingRoot.add(drawing);
				this.otherDrawings.set(uuid, drawing);
			}
			drawing.deserialize(data);
		});

		this.socket.on('delete_drawing', (uuid: string) => {
			this.otherDrawings.get(uuid)?.destroy();
			this.otherDrawings.delete(uuid);
		});
	}

	update(cursorPos: Vec2, input: InputManager) {


		// Switch modes

		if 			(input.keyPressed('E')) this.setTool('circle');
		else if (input.keyPressed('C')) this.setTool('cone');
		else if (input.keyPressed('T')) this.setTool('tile');
		else if (input.keyPressed('I')) this.setTool('line');

		// Update and select active shape.

		if (!this.current && this.drawTool !== 'tile') {
			for (let d of this.ownedDrawings.values()) {
				const interact = d.updateInteractions(cursorPos);
				if (interact) {
					if (input.mouseRightDown()) {
						this.ownedDrawings.delete(d.uuid);
						this.socket.emit('delete_drawing', d.uuid);
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

		for (let d of [ ...this.ownedDrawings.values(), this.current ]) {
			if (!d) continue;
			if (d.getAndClearDirty()) this.socket.emit('update_drawing', d.uuid, d.type, d.serialize());
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
			break;

		case 'tile':
			this.handleTile(cursorPos, input);
			break;
		}

		// Commit or destroy active shape.

		if (this.current) {
			if (input.keyPressed('SPACE')) {
				this.current.setTint(Color.HSVToInt(this.getColor()));
				this.ownedDrawings.set(this.current.uuid, this.current);
			}

			if (input.mouseLeftReleased()) {
				this.current.showIndicators(false);
				if (!this.ownedDrawings.has(this.current.uuid)) {
					this.socket.emit('delete_drawing', this.current.uuid);
					this.current.destroy();
				}
				this.current = undefined;
			}
		}
	}

	getTool(): DrawModeTool {
		return this.drawTool;
	}

	setTool(tool: DrawModeTool) {
		this.drawTool = tool;

		if (tool === 'tile') {
			this.controller.activate();
			this.ownedDrawings.forEach(d => {
				d.showIndicators(false);
				d.showHighlight(false);
				d.showHandles(false);
			});
		}
		else this.controller.deactivate();

		this.tool.dispatch({ currentTool: tool });
	}

	getColor(): Color.HSV {
		return this.scene.data.get('player_tint');
	}

	setColor(color: Color.HSV) {
		if (color.v === 0) color.v = 0.01;
		this.scene.data.set('player_tint', color);
		this.color.dispatch({ currentColor: color });
	}

	activate() {
		if (this.drawTool === 'tile') this.controller.activate();
		this.controller.setLayer(this.map.getHighlightLayer());
	}

	deactivate() {
		if (this.current && !this.ownedDrawings.has(this.current.uuid)) this.current.destroy();
		this.current = undefined;

		this.ownedDrawings.forEach(d => {
			d.showHandles(false);
			d.showHighlight(false);
			d.showIndicators(false);
		});

		this.controller.deactivate();
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
			if (!this.ownedDrawings.has(this.current.uuid)) return;
			const token = this.findPotentialAttach(circle, cursorPos);
			if (token) circle.attachToToken(token);
		}
	}

	private findPotentialAttach(shape: Shape, cursorPos: Vec2, highlight?: boolean): Token | undefined {
		shape.detachFromToken();
		const tilePos = cursorPos.floor();

		let found: Token | undefined = undefined;
		this.map.tokens.getAllTokens().forEach(t => {
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
			if (!this.ownedDrawings.has(this.current.uuid)) return;
			const token = this.findPotentialAttach(cone, cursorPos);
			if (token) cone.attachToToken(token);
		}
	}

	private handleTile(cursorPos: Vec2, input: InputManager) {
		this.controller.update(cursorPos, input);
		this.controller.setActiveTileType('wall');
		this.controller.setActiveTile(Color.HSVToInt(this.getColor()));
	}
}

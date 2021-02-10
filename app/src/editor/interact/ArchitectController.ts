import * as Phaser from 'phaser';

import MapLayer from '../map/MapLayer';
import InputManager from './InputManager';
import ActionManager from '../action/ActionManager';

import { Vec2 } from '../util/Vec';
import { Layer } from '../util/Layer';
import { TileItem } from '../action/Action';

export default class ArchitectController {
	activeTileset: number = 0;
	activeLayer: Layer = 'wall';

	private editMode: 'brush' | 'rect' | 'line' = 'brush';
	private pointerState: 'primary' | 'secondary' | null = null;

	private drawStartPos: Vec2 = new Vec2();

	private layer?: MapLayer;
	private drawn: TileItem[] = [];

	private cursor: Phaser.GameObjects.Sprite;
	private primitives: (Phaser.GameObjects.Line | Phaser.GameObjects.Sprite)[] = [];

	constructor(private scene: Phaser.Scene, private actions: ActionManager) {
		this.cursor = this.scene.add.sprite(0, 0, 'cursor');
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);
		this.cursor.setScale(1 / 16);
		this.cursor.setVisible(false);
	}

	update(cursorPos: Vec2, input: InputManager) {
		if (input.getContext() !== 'map') return;

		cursorPos = cursorPos.floor();

		this.cursor.setPosition(cursorPos.x, cursorPos.y);
		this.cursor.setVisible(cursorPos.x >= 0 && cursorPos.y >= 0 &&
			cursorPos.x < ((this.layer?.size.x) ?? 0) && cursorPos.y < ((this.layer?.size.y) ?? 0));

		if (input.mousePressed()) this.drawStartPos = cursorPos;

		switch(this.editMode) {
		default: break;
		
		case 'brush':
			this.drawBrush(cursorPos, input);
			break;
		
		case 'line':
			this.drawLine(cursorPos, input);
			break;

		case 'rect':
			this.drawRect(cursorPos, input);
			break;
		}

		if (!input.mouseDown()) {
			if (input.keyDown('SHIFT')) this.editMode = 'line';
			else if (this.editMode === 'line') this.editMode = 'brush';

			if (input.keyDown('CTRL')) this.editMode = 'rect';
			else if (this.editMode === 'rect') this.editMode = 'brush';
		}

		if (input.mouseDown()) {
			if (!this.pointerState) this.pointerState = input.mouseLeftDown() ? 'primary' : 'secondary';
		}
		else if (this.pointerState) {
			this.pointerState = null;

			if (this.drawn.length) {
				this.actions.push({ type: 'tile', items: this.drawn });
				this.drawn = [];
			}
		}
	}

	setLayer(layer?: MapLayer) {
		this.layer = layer;
	}

	setActiveTileType(type: Layer) {
		this.activeLayer = type;
	}

	setActiveTile(tile: number) {
		this.activeTileset = tile;
	}

	activate() {
		this.cursor.setVisible(true);
	}

	deactivate() {
		this.cursor.setVisible(false);
	}

	private drawBrush(cursorPos: Vec2, input: InputManager) {
		if (input.mouseDown()) {
			const change = new Vec2(cursorPos.x - this.drawStartPos.x, cursorPos.y - this.drawStartPos.y);
			const normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y) * 10;
			change.x /= normalizeFactor; change.y /= normalizeFactor;

			const place = new Vec2(this.drawStartPos.x, this.drawStartPos.y);

			while (Math.abs(cursorPos.x - place.x) >= 0.1 || Math.abs(cursorPos.y - place.y) >= 0.1) {
				this.drawTile(place.floor(), input.mouseLeftDown());
				place.x += change.x; place.y += change.y;
			}

			this.drawTile(cursorPos, input.mouseLeftDown());

			this.drawStartPos = cursorPos;
		}
	}

	private drawLine(cursorPos: Vec2, input: InputManager) {
		const a = new Vec2(this.drawStartPos.x, this.drawStartPos.y);
		const b = new Vec2(cursorPos.x, cursorPos.y);

		if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y)) b.y = a.y;
		else b.x = a.x;

		this.primitives.forEach(v => v.destroy());
		this.primitives = [];

		if (input.mouseDown()) {
			this.cursor.setPosition(b.x, b.y);

			const line = this.scene.add.line(0, 0, a.x + 0.5, a.y + 0.5, b.x + 0.5, b.y + 0.5, 0xffffff, 1);
			line.setOrigin(0, 0);
			line.setDepth(300);
			line.setLineWidth(0.03);
			this.primitives.push(line);

			const startSprite = this.scene.add.sprite(this.drawStartPos.x, this.drawStartPos.y, 'cursor');
			startSprite.setOrigin(0, 0);
			startSprite.setScale(1 / 16);
			startSprite.setAlpha(0.5);
			this.primitives.push(startSprite);
		}
		else if (this.pointerState) {
			const change = new Vec2(b.x - a.x, b.y - a.y);
			const normalizeFactor = Math.sqrt(change.x * change.x + change.y * change.y);
			change.x /= normalizeFactor;
			change.y /= normalizeFactor;

			while (Math.abs(b.x - a.x) >= 1 || Math.abs(b.y - a.y) >= 1) {
				this.drawTile(new Vec2(Math.floor(a.x), Math.floor(a.y)), this.pointerState === 'primary');
				a.x += change.x;
				a.y += change.y;
			}

			this.drawTile(new Vec2(b.x, b.y), this.pointerState === 'primary');
		}
	}

	private drawRect(cursorPos: Vec2, input: InputManager) {
		const a = new Vec2(Math.min(this.drawStartPos.x, cursorPos.x), Math.min(this.drawStartPos.y, cursorPos.y));
		const b = new Vec2(Math.max(this.drawStartPos.x, cursorPos.x), Math.max(this.drawStartPos.y, cursorPos.y));

		this.primitives.forEach(v => v.destroy());
		this.primitives = [];

		if (input.mouseDown()) {
			if (!this.pointerState) this.drawStartPos = cursorPos;

			const fac = 0.03;
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac, b.x + 1 - fac, a.y + fac, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac / 2, a.x + fac, b.y + 1 - fac / 2, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, b.y + 1 - fac, b.x + 1 - fac, b.y + 1 - fac, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, b.x + 1 - fac, a.y + fac / 2, b.x + 1 - fac, b.y + 1 - fac / 2, 0xffffff, 1));

			this.primitives.forEach(v => {
				(v as Phaser.GameObjects.Line).setLineWidth(0.03);
				v.setOrigin(0, 0);
				v.setDepth(300);
			});
		}
		else if (this.pointerState) {

			for (let i = a.x; i <= b.x; i++)
				for (let j = a.y; j <= b.y; j++)
					this.drawTile(new Vec2(i, j), this.pointerState === 'primary');
		}
	}

	private drawTile(pos: Vec2, solid: boolean) {
		if (!this.layer) return;

		let tile = solid ? this.activeTileset : 0;
		const lastTile = this.layer.getTile(this.activeLayer, pos);

		if (this.layer.setTile(this.activeLayer, tile, pos)) {
			this.drawn.push({
				pos, tile: { pre: lastTile, post: tile },
				layer: this.activeLayer, mapLayer: this.layer.index
			});
		}
	}
}

import * as Phaser from 'phaser';

import Mode from './Mode';
import Token from '../Token';
import Map from '../map/Map';
import InputManager from '../InputManager';
import HistoryManager from '../history/HistoryManager';

import { Vec2 } from '../util/Vec';

export const TokenModeKey = 'TOKEN';

export default class TokenMode extends Mode {

	placeTokenType: string = '';

	private bound: boolean = false;
	private editMode: 'place' | 'select' | 'move' = 'place';

	private preview: Token;

	private hovered: Token | null = null;
	private selected: Set<Token> = new Set();

	private startTilePos: Vec2 = new Vec2();
	private preMoveSerialized: string[] | null = null;
	private clickTestState: null | false | true = null;

	private cursor: Phaser.GameObjects.Sprite;
	private primitives: (Phaser.GameObjects.Line | Phaser.GameObjects.Sprite)[] = [];

	constructor(scene: Phaser.Scene, map: Map, history: HistoryManager) {
		super(scene, map, history);

		this.cursor = this.scene.add.sprite(0, 0, 'cursor');
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);
		this.cursor.setScale(1 / 16);
		this.cursor.setVisible(false);

		this.preview = new Token(this.scene, 0, 0, '');
		this.scene.add.existing(this.preview);
		this.preview.setVisible(false);
		this.preview.setAlpha(0.2);
	}

	update(cursorPos: Vec2, input: InputManager) {
		if (!this.bound) {
			input.bindScrollEvent((delta: number) => {
				if (this.editMode !== 'place') return;
				this.selected.forEach(token => {
					let frame = token.getFrame() + delta;
					if (frame < 0) frame += token.frameCount();
					frame %= token.frameCount();
					token.setFrame(frame);
				});
			});

			this.bound = true;
		}

		if (input.getContext() !== 'map') return;

		cursorPos = cursorPos.floor();

		if (this.preview.sprite.texture.key !== this.placeTokenType) this.preview.setTexture(this.placeTokenType);

		switch (this.editMode) {
		default: break;
		case 'place':
			this.handlePlace(cursorPos, input);
			break;

		case 'select':
			this.handleSelect(cursorPos, input);
			break;

		case 'move':
			this.handleMove(cursorPos, input);
		}

		this.preview.setPosition(cursorPos.x, cursorPos.y);
		this.cursor.setPosition(cursorPos.x, cursorPos.y);

		this.preview.setVisible(!!this.placeTokenType && !this.hovered);
		this.cursor.setVisible(!this.placeTokenType && !this.hovered);
	}

	activate() { /* No activation logic */ }

	deactivate() {
		this.selected.forEach(t => t.setSelected(false));
		this.selected = new Set();
		
		if (this.hovered) this.hovered.setHovered(false);
		this.hovered = null;

		this.primitives.forEach(e => e.destroy());
		this.primitives = [];

		this.cursor.setVisible(false);
		this.preview.setVisible(false);
	}

	private handlePlace(cursorPos: Vec2, input: InputManager) {
		if (this.selected.size) this.keyboardMoveToken(input);

		// Find the currently hovered token.
		if (!this.hovered || this.hovered.x !== cursorPos.x || this.hovered.y !== cursorPos.y) {
			this.hovered?.setHovered(false);
			this.hovered = null;

			for (let i = this.map.tokens.length - 1; i >= 0; i--) {
				let token = this.map.tokens[i];
				if (cursorPos.x === token.x && cursorPos.y === token.y) {
					this.hovered = token;
					this.hovered.setHovered(true);
					break;
				}
			}
		}

		// Place / select token, start moving if any are selected.
		if (input.mouseLeftPressed()) {
			if (!this.hovered) {
				if (this.placeTokenType) {
					let token = this.placeToken(cursorPos);
					token.setSelected(true);
					this.hovered = token;
				}
				else {
					this.startTilePos = cursorPos;
					this.editMode = 'select';
					return;
				}
			}

			if (input.keyDown('CTRL')) {
				if (this.hovered && !this.selected.has(this.hovered)) {
					this.hovered.setSelected(true);
					this.selected.add(this.hovered);
				}
				else this.clickTestState = false;
			}
			else {
				this.selected.forEach(t => t.setSelected(false));
				if (this.hovered) {
					this.selected = new Set([ this.hovered ]);
					this.hovered.setSelected(true);
				}
			}

			if (this.selected.size) {
				this.startTilePos = cursorPos;
				this.editMode = 'move';
			}
		}

		if (input.keyDown('DELETE') && this.selected.size > 0) {
			let serialized: string[] = [];
			this.selected.forEach(t => {
				serialized.push(t.serialize());
				this.deleteToken(t);
			});

			this.selected = new Set();
			this.history.push({ type: 'delete_token', tokens: serialized });
		}
	}

	private handleSelect(cursorPos: Vec2, input: InputManager) {

		const a = new Vec2(Math.min(this.startTilePos.x, cursorPos.x), Math.min(this.startTilePos.y, cursorPos.y));
		const b = new Vec2(Math.max(this.startTilePos.x, cursorPos.x), Math.max(this.startTilePos.y, cursorPos.y));

		this.primitives.forEach(v => v.destroy());
		this.primitives = [];

		if (!input.mouseLeftDown()) {
			if (!input.keyDown('CTRL')) {
				for (const t of this.selected) t.setSelected(false);
				this.selected = new Set();
			}

			for (const token of this.map.tokens) {
				if (token.x >= a.x && token.y >= a.y && token.x <= b.x && token.y <= b.y) {

					if (input.keyDown('CTRL')) {
						const selected = this.selected.has(token);
						token.setSelected(!selected);
						if (selected) this.selected.delete(token);
						else this.selected.add(token);
					}
					else {
						this.selected.add(token);
						token.setSelected(true);
					}
				}
			}

			this.editMode = 'place';
			return;
		}

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

	private handleMove(cursorPos: Vec2, input: InputManager) {
		this.cursor.setVisible(false);

		if (!this.preMoveSerialized) {
			this.preMoveSerialized = [];
			for (let t of this.selected) this.preMoveSerialized.push(t.serialize());
		}

		if (!this.selected.size) {
			this.editMode = 'place';
			return;
		}

		if (!input.mouseLeftDown()) {
			this.editMode = 'place';

			if (this.clickTestState) {
				const currSerialized = [];
				for (let t of this.selected) currSerialized.push(t.serialize());
				this.history.push({ type: 'modify_token', tokens: { pre: this.preMoveSerialized!, post: currSerialized } });
				this.preMoveSerialized = null;
			}
			else if (this.clickTestState === false && this.hovered && input.keyDown('CTRL')) {
				this.selected.delete(this.hovered);
				this.hovered.setSelected(false);
			}

			this.clickTestState = null;

			return;
		}
		
		let offset = new Vec2(cursorPos.x - this.startTilePos.x, cursorPos.y - this.startTilePos.y);
		if (!offset.x && !offset.y) return;

		this.clickTestState = true;
		this.startTilePos = cursorPos;

		this.selected.forEach(t => t.setPosition(t.x + offset.x, t.y + offset.y));
	}

	private placeToken(cursorPos: Vec2): Token {
		let token = new Token(this.scene, cursorPos.x, cursorPos.y, this.placeTokenType);
		this.scene.add.existing(token);
		this.map.tokens.push(token);

		this.history.push({ type: 'place_token', tokens: [ token.serialize() ] });

		return token;
	}

	private deleteToken(token: Token) {
		this.selected.delete(token);
		if (this.hovered === token) this.hovered = null;

		for (let i = 0; i < this.map.tokens.length; i++) {
			if (this.map.tokens[i] === token) {
				this.map.tokens.splice(i, 1);
				break;
			}
		}

		token.destroy();
	}

	private keyboardMoveToken(input: InputManager): void {
		if (input.keyPressed('UP')) this.moveToken(0, -1, 2);
		if (input.keyPressed('LEFT')) this.moveToken(-1, 0, 1);
		if (input.keyPressed('DOWN')) this.moveToken(0, 1, 0);
		if (input.keyPressed('RIGHT')) this.moveToken(1, 0, 3);
	}

	private moveToken(x: number, y: number, frame: number): void {
		let preSerialized: string[] = [];
		let postSerialized: string[] = [];
		this.selected.forEach((token) => {
			preSerialized.push(token.serialize());
			token.x += x;
			token.y += y;
			token.setFrame(frame);
			postSerialized.push(token.serialize());
		});
		
		this.history.push({ type: 'modify_token', tokens: { pre: preSerialized, post: postSerialized } });
	}
}

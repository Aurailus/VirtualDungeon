import * as Phaser from 'phaser';

import Mode from './Mode';
import Map from '../map/Map';
import InputManager from '../InputManager';
import ActionManager from '../action/ActionManager';
import Token, { TokenData, TokenRenderData } from '../map/token/Token';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';

export const TokenModeKey = 'TOKEN';

export default class TokenMode extends Mode {

	placeTokenType: string = '';

	private bound: boolean = false;
	private editMode: 'place' | 'select' | 'move' = 'place';

	private preview: Token;

	private hovered: Token | null = null;
	private selected: Set<Token> = new Set();

	private startTilePos: Vec2 = new Vec2();
	private preMove: TokenRenderData[] | null = null;
	private clickTestState: null | false | true = null;

	private cursor: Phaser.GameObjects.Sprite;
	private primitives: (Phaser.GameObjects.Line | Phaser.GameObjects.Sprite)[] = [];

	constructor(scene: Phaser.Scene, map: Map, actions: ActionManager, assets: Asset[]) {
		super(scene, map, actions, assets);

		this.cursor = this.scene.add.sprite(0, 0, 'cursor');
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);
		this.cursor.setScale(1 / 16);
		this.cursor.setVisible(false);

		this.preview = new Token(this.scene);
		this.scene.add.existing(this.preview);
		this.preview.setVisible(false);
		this.preview.setAlpha(0.2);
	}

	update(cursorPos: Vec2, input: InputManager) {
		if (!this.bound) {
			input.bindScrollEvent((delta: number) => {
				if (this.editMode !== 'move') return false;
				this.selected.forEach(token => {
					let index = token.getFrameIndex() + delta;
					if (index < 0) index += token.getFrameCount();
					index %= token.getFrameCount();
					token.setFrame(index);
				});
				return true;
			});
			this.bound = true;
		}

		if (input.getContext() !== 'map') return;

		cursorPos = cursorPos.floor();

		if (this.preview.texture.key !== this.placeTokenType) this.preview.setTexture(this.placeTokenType, 0);

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

			for (let i = this.map.tokens.getAllTokens().length - 1; i >= 0; i--) {
				let token = this.map.tokens.getAllTokens()[i];
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
			const tokens = Array.from(this.selected).map(t => this.deleteToken(t)).filter(t => t) as TokenData[];
			this.selected = new Set();
			this.actions.push({ type: 'delete_token', tokens });
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

			for (const token of this.map.tokens.getAllTokens()) {
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

		if (!this.preMove) this.preMove = Array.from(this.selected).map(t => t.getRender());

		if (!this.selected.size) {
			this.editMode = 'place';
			return;
		}

		if (!input.mouseLeftDown()) {
			this.editMode = 'place';

			if (this.clickTestState) {
				const post: TokenRenderData[] = [];
				for (let t of this.selected) post.push(t.getRender());
				this.actions.push({ type: 'modify_token', tokens: { pre: this.preMove!, post } });
				this.preMove = null;
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
		const asset = this.assets.filter(a => a.identifier === this.placeTokenType)[0];
		const token = this.map.tokens.createToken(cursorPos, { name: asset.name }, this.placeTokenType);
		this.actions.push({ type: 'place_token', tokens: [ token.serialize() ] });
		return token;
	}

	private deleteToken(token: Token): TokenData | undefined {
		this.selected.delete(token);
		if (this.hovered === token) this.hovered = null;
		return this.map.tokens.deleteToken(token);
	}

	private keyboardMoveToken(input: InputManager): void {
		if (input.keyPressed('UP')) this.moveToken(0, -1, 2);
		if (input.keyPressed('LEFT')) this.moveToken(-1, 0, 1);
		if (input.keyPressed('DOWN')) this.moveToken(0, 1, 0);
		if (input.keyPressed('RIGHT')) this.moveToken(1, 0, 3);
	}

	private moveToken(x: number, y: number, index: number): void {
		let pre: TokenRenderData[] = [];
		let post: TokenRenderData[] = [];

		this.selected.forEach((token) => {
			const old = token.getRender();
			pre.push(old);
			token.setPosition(old.pos.x + x, old.pos.y + y);
			token.setTexture(old.appearance.sprite, index);
			post.push(token.getRender());
		});
		
		this.actions.push({ type: 'modify_token', tokens: { pre, post } });
	}
}

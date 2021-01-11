import * as Phaser from 'phaser';

import Map from '../map/Map';
import Token from '../Token';
import InputManager from '../InputManager';
import type { HistoryType } from './HistoryType';

export default class HistoryManager {
	private map: Map = null as any;
	private scene: Phaser.Scene = null as any;

	private history: HistoryType[] = [];
	private head: number = -1;

	private historyHeldTime: number = 0;

	init(scene: Phaser.Scene, map: Map) {
		this.map = map;
		this.scene = scene;
	}

	update(input: InputManager) {
		if (input.keyPressed('Z')) {
			this.historyHeldTime = 0;
			if (!input.keyDown('SHIFT')) this.undo();
			else this.redo();
		}
		if (input.keyPressed('Y')) {
			this.historyHeldTime = 0;
			this.redo();
		}

		if (input.keyDown('Z') || input.keyDown('Y')) {
			if (this.historyHeldTime > 12 && this.historyHeldTime % 3 === 0) {
				if (input.keyDown('Y') || (input.keyDown('Z') && input.keyDown('SHIFT'))) this.redo();
				else this.undo();
			}
			this.historyHeldTime++;
		}
		else this.historyHeldTime = 0;
	}

	push(item: HistoryType): void {
		this.history.splice(this.head + 1, this.history.length - this.head, item);
		this.head = this.history.length - 1;
	}

	undo() {
		if (!this.hasPrev() || !this.map) return;
		const item = this.history[this.head--];

		switch (item.type) {
		default:
			console.warn('Unhandled undo ', item);
			break;

		case 'tile':
			for (const tile of item.items)
				this.map.getLayer(tile.mapLayer)?.setTile(tile.layer, tile.tile.pre, tile.pos);
			break;

		case 'place_token':
			item.tokens.forEach(t => {
				const { uuid } = JSON.parse(t);
				for (let i = 0; i < this.map.tokens.length; i++) {
					if (this.map.tokens[i].uuid === uuid) {
						this.map.tokens[i].destroy();
						this.map.tokens.splice(i, 1);
						break;
					}
				}
			});
			break;

		case 'delete_token':
			item.tokens.forEach(t => {
				const token = new Token(this.scene, 0, 0, '');
				token.loadSerializedData(t);
				this.scene.add.existing(token);
				this.map.tokens.push(token);
			});
			break;
		
		case 'modify_token':
			for (let i = 0; i < item.tokens.pre.length; i++) {
				const { uuid } = JSON.parse(item.tokens.pre[i]);
				let found = false;
				for (const token of this.map.tokens) {
					if (token.uuid === uuid) {
						token.loadSerializedData(item.tokens.pre[i]);
						found = true;
						break;
					}
				}
				if (found) continue;
				const token = new Token(this.scene, 0, 0, '');
				token.loadSerializedData(item.tokens.pre[i]);
				this.scene.add.existing(token);
				this.map.tokens.push(token);
			}
			break;
		}
	}

	redo() {
		if (!this.hasNext() || !this.map) return;
		const item = this.history[++this.head];

		switch (item.type) {
		default:
			console.warn('Unhandled redo ', item);
			break;
		
		case 'tile':
			for (let tile of item.items)
				this.map.getLayer(tile.mapLayer)?.setTile(tile.layer, tile.tile.post, tile.pos);
			break;

		case 'place_token':
			item.tokens.forEach(t => {
				const token = new Token(this.scene, 0, 0, '');
				token.loadSerializedData(t);
				this.scene.add.existing(token);
				this.map.tokens.push(token);
			});
			break;
		
		case 'delete_token':
			item.tokens.forEach(t => {
				const { uuid } = JSON.parse(t);

				for (let i = 0; i < this.map.tokens.length; i++) {
					if (this.map.tokens[i].uuid === uuid) {
						this.map.tokens[i].destroy();
						this.map.tokens.splice(i, 1);
						break;
					}
				}
			});
			break;
		
		case 'modify_token':
			for (let i = 0; i < item.tokens.post.length; i++) {
				const { uuid } = JSON.parse(item.tokens.post[i]);
				let found = false;
				for (const token of this.map.tokens) {
					if (token.uuid === uuid) {
						token.loadSerializedData(item.tokens.post[i]);
						found = true;
						break;
					}
				}
				if (found) continue;
				const token = new Token(this.scene, 0, 0, '');
				token.loadSerializedData(item.tokens.post[i]);
				this.scene.add.existing(token);
				this.map.tokens.push(token);
			}
			break;
		}
	}

	hasPrev(): boolean {
		return this.head >= 0;
	}

	hasNext(): boolean {
		return this.head < this.history.length - 1;
	}
}

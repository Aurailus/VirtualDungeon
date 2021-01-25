import * as Phaser from 'phaser';
import IO from 'socket.io-client';

import Map from '../map/Map';
import type { Action } from './Action';
import ActionEvent from './ActionEvent';
import EventHandler from '../EventHandler';
import InputManager from '../InputManager';

const SAVE_INTERVAL = 5 * 1000;

export default class ActionManager {
	readonly event = new EventHandler<ActionEvent>();

	private map: Map = null as any;
	private socket: IO.Socket = null as any;

	private head: number = -1;
	private history: Action[] = [];

	private historyHeldTime: number = 0;
	private editTime: number | false = false;

	init(_scene: Phaser.Scene, map: Map, socket: IO.Socket) {
		this.map = map;
		// this.scene = scene;
		this.socket = socket;

		this.socket.on('action', this.apply.bind(this));
	}

	update(input: InputManager) {
		if (input.keyPressed('Z')) {
			this.historyHeldTime = 0;
			if (!input.keyDown('SHIFT')) this.prev();
			else this.next();
		}
		if (input.keyPressed('Y')) {
			this.historyHeldTime = 0;
			this.next();
		}

		if (input.keyDown('Z') || input.keyDown('Y')) {
			if (this.historyHeldTime > 12 && this.historyHeldTime % 3 === 0) {
				if (input.keyDown('Y') || (input.keyDown('Z') && input.keyDown('SHIFT'))) this.next();
				else this.prev();
			}
			this.historyHeldTime++;
		}
		else this.historyHeldTime = 0;

		if (this.editTime && Date.now() - SAVE_INTERVAL > this.editTime) {
			this.socket.emit('serialize', this.map.identifier, this.map.save());
			this.editTime = 0;
		}
	}

	push(item: Action): void {
		this.history.splice(this.head + 1, this.history.length - this.head, item);
		this.head = this.history.length - 1;
		if (!this.editTime) this.editTime = Date.now();

		this.socket.emit('action', item);
		this.event.dispatch({ event: 'push', head: this.head, length: this.history.length });
	}

	apply(item: Action): void {
		this.history.splice(this.head + 1, this.history.length - this.head, item);
		this.next();
	}

	prev() {
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
			item.tokens.forEach(({ uuid }) => this.map.tokens.deleteToken(uuid));
			break;

		case 'delete_token':
			item.tokens.forEach(t => this.map.tokens.createToken(t.render.pos as any,
				{ uuid: t.uuid, ...t.meta }, t.render.appearance.sprite, t.render.appearance.index));
			break;
		
		case 'modify_token':
			for (let i = 0; i < item.tokens.pre.length; i++)
				this.map.tokens.setRender(item.tokens.pre[i].uuid, item.tokens.pre[i]);
			break;
		}

		this.event.dispatch({ event: 'prev', head: this.head, length: this.history.length });
	}

	next() {
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
			item.tokens.forEach(t => this.map.tokens.createToken(t.render.pos as any,
				{ uuid: t.uuid, ...t.meta }, t.render.appearance.sprite, t.render.appearance.index));
			break;
		
		case 'delete_token':
			item.tokens.forEach(({ uuid }) => this.map.tokens.deleteToken(uuid));
			break;
		
		case 'modify_token':
			for (let i = 0; i < item.tokens.post.length; i++)
				this.map.tokens.setRender(item.tokens.post[i].uuid, item.tokens.post[i]);
			break;
		}

		this.event.dispatch({ event: 'next', head: this.head, length: this.history.length });
	}

	hasPrev(): boolean {
		return this.head >= 0;
	}

	hasNext(): boolean {
		return this.head < this.history.length - 1;
	}
}

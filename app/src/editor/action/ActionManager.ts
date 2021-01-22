import * as Phaser from 'phaser';
import IO from 'socket.io-client';

import Map from '../map/Map';
// import Token from '../map/token/Token';
import type { Action } from './Action';
import ActionEvent from './ActionEvent';
import EventHandler from '../EventHandler';
import InputManager from '../InputManager';

export default class ActionManager {
	private map: Map = null as any;
	private socket: IO.Socket = null as any;
	// private scene: Phaser.Scene = null as any;

	private history: Action[] = [];
	private head: number = -1;

	private evtHandler = new EventHandler<ActionEvent>();

	private historyHeldTime: number = 0;

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
	}

	push(item: Action): void {
		this.history.splice(this.head + 1, this.history.length - this.head, item);
		this.head = this.history.length - 1;

		this.socket.emit('action', item);
		this.evtHandler.dispatch({ event: 'push', head: this.head, length: this.history.length });
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
			item.tokens.forEach(t => this.map.tokens.createToken(t));
			break;
		
		case 'modify_token':
			for (let i = 0; i < item.tokens.pre.length; i++) {
				const token = this.map.tokens.getToken(item.tokens.pre[i].uuid);
				if (token) token.setToken(item.tokens.pre[i]);
				else this.map.tokens.createToken(item.tokens.pre[i]);
			}
			break;
		}

		this.evtHandler.dispatch({ event: 'prev', head: this.head, length: this.history.length });
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
			item.tokens.forEach(t => this.map.tokens.createToken(t));
			break;
		
		case 'delete_token':
			item.tokens.forEach(({ uuid }) => this.map.tokens.deleteToken(uuid));
			break;
		
		case 'modify_token':
			for (let i = 0; i < item.tokens.post.length; i++) {
				const token = this.map.tokens.getToken(item.tokens.post[i].uuid);
				if (token) token.setToken(item.tokens.post[i]);
				else this.map.tokens.createToken(item.tokens.post[i]);
			}
			break;
		}

		this.evtHandler.dispatch({ event: 'next', head: this.head, length: this.history.length });
	}

	hasPrev(): boolean {
		return this.head >= 0;
	}

	hasNext(): boolean {
		return this.head < this.history.length - 1;
	}

	bind(cb: (evt: ActionEvent) => boolean | void) {
		this.evtHandler.bind(cb);
	}

	unbind(cb: (evt: ActionEvent) => boolean | void) {
		this.evtHandler.unbind(cb);
	}
}

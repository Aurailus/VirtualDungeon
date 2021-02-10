import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import InputManager from '../interact/InputManager';

import Ping from './Ping';

import { Vec2 } from '../util/Vec';
import * as Color from '../../../../common/Color';

const TIMEOUT = 250;

export default class PingHandler {
	private socket: IO.Socket = null as any;
	private scene: Phaser.Scene = null as any;
	private input: InputManager = null as any;

	private clickTime: number | undefined;
	private mouseDelta: Vec2 | undefined;
	private lastMousePos: Vec2 | undefined;

	private pings: Ping[] = [];

	init(scene: Phaser.Scene, input: InputManager, socket: IO.Socket) {
		this.scene = scene;
		this.input = input;
		this.socket = socket;

		socket.on('ping', ({ pos, color }: { pos: Vec2; color: number }) => this.createPing(pos, color, false));
	}

	update(cursorWorld: Vec2) {
		const now = Date.now();

		if (this.input.mouseMiddlePressed()) {
			this.clickTime = now;
			this.mouseDelta = new Vec2();
			this.lastMousePos = this.input.getMousePos();
		}

		if (this.input.mouseMiddleDown() && this.clickTime) {
			const mousePos = this.input.getMousePos();
			const delta = new Vec2(this.lastMousePos!.x - mousePos.x, this.lastMousePos!.y - mousePos.y);
			this.mouseDelta = new Vec2(this.mouseDelta!.x + Math.abs(delta.x), this.mouseDelta!.y + Math.abs(delta.y));
			this.lastMousePos = mousePos;

			if (this.clickTime! < now - TIMEOUT || this.mouseDelta.length() > 16) this.reset();
		}

		for (let i = 0; i < this.pings.length; i++) {
			const p = this.pings[i];
			p.update();
			if (p.shouldDie()) {
				p.destroy();
				this.pings.splice(i, 1);
				i--;
			}
		};

		if (this.input.mouseMiddleReleased() && this.clickTime) {
			this.createPing(cursorWorld, Color.HSVToInt(this.scene.data.get('player_tint')));
			this.reset();
		}
	}

	private createPing(pos: Vec2, color: number = 0xffffff, networked: boolean = true) {
		this.pings.push(new Ping(this.scene, pos, color));
		if (networked) this.socket.emit('ping', { pos, color });
	}

	private reset() {
		this.clickTime = undefined;
		this.mouseDelta = undefined;
		this.lastMousePos = undefined;
	}
}

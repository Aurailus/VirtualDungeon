import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import Mode from './Mode';
import Map from '../map/Map';
import InputManager from '../interact/InputManager';
import ActionManager from '../action/ActionManager';
import ArchitectController from '../interact/ArchitectController';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';

export const ArchitectModeKey = 'ARCHITECT';

export default class ArchitectMode extends Mode {
	readonly controller: ArchitectController;

	constructor(scene: Phaser.Scene, map: Map, socket: IO.Socket, actions: ActionManager, assets: Asset[]) {
		super(scene, map, socket, actions, assets);
		this.controller = new ArchitectController(scene, actions);
	}

	update(cursorPos: Vec2, input: InputManager) {
		this.controller.setLayer(this.map.getActiveLayer());
		this.controller.update(cursorPos, input);
	}

	activate() {
		this.controller.activate();
	}

	deactivate() {
		this.controller.deactivate();
	}
}

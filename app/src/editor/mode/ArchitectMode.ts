import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import Mode from './Mode';
import Map from '../map/Map';
import InputManager from '../interact/InputManager';
import ActionManager from '../action/ActionManager';
import ArchitectController from '../interact/ArchitectController';

import { Vec2 } from '../util/Vec';
import { Asset } from '../../../../common/DBStructs';


/** The mode key of this mode. */
export const ArchitectModeKey = 'ARCHITECT';

/** Handles adding and removing tiles. */
export default class ArchitectMode extends Mode {
	
	/** The underlying architect controller that manages interactions. */
	readonly controller: ArchitectController;

	constructor(scene: Phaser.Scene, map: Map, socket: IO.Socket, actions: ActionManager, assets: Asset[]) {
		super(scene, map, socket, actions, assets);
		this.controller = new ArchitectController(scene, actions);
	}


	/**
	 * Updates the underlying architect controller,
	 * allowing tiles to be added and removed.
	 *
	 * @param {Vec2} cursorPos - The cursor's position.
	 * @param {InputManager} input - The input manager.
	 */

	update(cursorPos: Vec2, input: InputManager) {
		this.controller.setLayer(this.map.getActiveLayer());
		this.controller.update(cursorPos, input);
	}


	/**
	 * Activates this mode, and begins listening for input.
	 */

	activate() {
		this.controller.activate();
	}


	/**
	 * Deactivates this mode, ceasing all events.
	 */

	deactivate() {
		this.controller.deactivate();
	}
}

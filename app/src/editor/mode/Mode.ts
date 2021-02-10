import * as IO from 'socket.io-client';

import type Map from '../map/Map';
import InputManager from '../interact/InputManager';
import ActionManager from '../action/ActionManager';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';


/**
 * Abstract base class for editor modes.
 */

export default abstract class Mode {
	constructor(protected scene: Phaser.Scene, protected map: Map, protected socket: IO.Socket,
		protected actions: ActionManager, protected assets: Asset[]) {}

	abstract update(cursorPos: Vec2, input: InputManager): void;

	abstract activate(): void;

	abstract deactivate(): void;
}

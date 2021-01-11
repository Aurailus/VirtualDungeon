import type Map from '../map/Map';
import InputManager from '../InputManager';
import HistoryManager from '../history/HistoryManager';

import { Vec2 } from '../util/Vec';


/**
 * Abstract base class for editor modes.
 */

export default abstract class Mode {
	constructor(protected scene: Phaser.Scene, protected map: Map, protected history: HistoryManager) {}

	abstract update(cursorPos: Vec2, input: InputManager): void;

	abstract activate(): void;

	abstract deactivate(): void;
}

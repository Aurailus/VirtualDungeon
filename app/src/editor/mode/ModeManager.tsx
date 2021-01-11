import type * as Phaser from 'phaser';

import type Mode from './Mode';
import type Map from '../map/Map';
import InputManager from '../InputManager';
import HistoryManager from '../history/HistoryManager';

import TokenMode, { TokenModeKey } from './TokenMode';
import ArchitectMode, { ArchitectModeKey } from './ArchitectMode';

import { Vec2 } from '../util/Vec';


/**
 * Manages initializing and toggling editor modes.
 */

export default class ModeManager {
	active: Mode | undefined;

	private modeStr: string = '';
	private modes: { [mode: string]: Mode } = {};

	init(scene: Phaser.Scene, map: Map, history: HistoryManager) {
		this.modes = {
			[ArchitectModeKey]: new ArchitectMode(scene, map, history),
			[TokenModeKey]: new TokenMode(scene, map, history)
		};

		this.activate(Object.keys(this.modes)[0]);
	}

	activate(mode: string) {
		this.active?.deactivate();
		this.active = this.modes[mode];
		this.active?.activate();
		this.modeStr = mode;
	}

	getActive(): string {
		return this.modeStr;
	}

	update(cursorPos: Vec2, input: InputManager) {
		this.active?.update(cursorPos, input);
	}
}

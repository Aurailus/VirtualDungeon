import type * as Phaser from 'phaser';

import type Mode from './Mode';
import type Map from '../map/Map';
import InputManager from '../InputManager';
import EventHandler from '../EventHandler';
import ActionManager from '../action/ActionManager';

import DrawMode, { DrawModeKey } from './DrawMode';
import TokenMode, { TokenModeKey } from './TokenMode';
import ArchitectMode, { ArchitectModeKey } from './ArchitectMode';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';

export interface ModeSwitchEvent {
	from: string;
	to: string;
}

/**
 * Manages initializing and toggling editor modes.
 */

export default class ModeManager {
	active: Mode | undefined;

	private modeStr: string = '';
	private modes: { [mode: string]: Mode } = {};

	private evtHandler = new EventHandler<ModeSwitchEvent>();

	init(scene: Phaser.Scene, map: Map, actions: ActionManager, assets: Asset[]) {
		this.modes = {
			[ArchitectModeKey]: new ArchitectMode(scene, map, actions, assets),
			[TokenModeKey]: new TokenMode(scene, map, actions, assets),
			[DrawModeKey]: new DrawMode(scene, map, actions, assets)
		};

		this.activate(Object.keys(this.modes)[0]);
	}

	activate(mode: string) {
		this.evtHandler.dispatch({ from: this.modeStr, to: mode });
		this.active?.deactivate();
		this.active = this.modes[mode];
		this.active?.activate();
		this.modeStr = mode;
	}

	getActive(): string {
		return this.modeStr;
	}

	getActiveInstance(): Mode {
		return this.active!;
	}

	update(cursorPos: Vec2, input: InputManager) {
		this.active?.update(cursorPos, input);
	}

	bind(cb: (evt: ModeSwitchEvent) => boolean | void) {
		this.evtHandler.bind(cb);
	}

	unbind(cb: (evt: ModeSwitchEvent) => boolean | void) {
		this.evtHandler.unbind(cb);
	}
}

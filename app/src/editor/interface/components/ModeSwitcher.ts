import type * as Phaser from 'phaser';

import Component from './Component';

import InputMananger from '../../InputManager';
import ModeMananger from '../../mode/ModeManager';
import { TokenModeKey } from '../../mode/TokenMode';
import { ArchitectModeKey } from '../../mode/ArchitectMode';

import { Vec4 } from '../../util/Vec';

export default class ModeSwitcher extends Component {
	private button: Phaser.GameObjects.Sprite;

	constructor(scene: Phaser.Scene, x: number, y: number,
		private inputManager: InputMananger, private mode: ModeMananger) {
		super(scene, x, y);

		this.collision = new Vec4(0, 0, 38, 17);

		this.button = this.scene.add.sprite(0, 0, 'ui_mode_switch');
		this.button.setOrigin(0);
		this.add(this.button);
	}

	update() {
		const collides = this.mouseCollides();
		const cursorPos = this.getCursorPos();

		if (collides) {
			if (this.mode.getActive() === ArchitectModeKey) {
				if (cursorPos.x > 19) {
					this.button.setFrame(2);
					if (this.inputManager.mouseLeftPressed()) this.mode.activate(TokenModeKey);
				}
				else this.button.setFrame(1);
			}
			else {
				if (cursorPos.x <= 19) {
					this.button.setFrame(3);
					if (this.inputManager.mouseLeftPressed()) this.mode.activate(ArchitectModeKey);
				}
				else this.button.setFrame(0);
			}
		}
		else {
			if (this.mode.getActive() === ArchitectModeKey) this.button.setFrame(1);
			else this.button.setFrame(0);
		}
	}
}

import type * as Phaser from 'phaser';

import Component from './Component';

import type InputManager from '../../InputManager';
import type HistoryManager from '../../history/HistoryManager';

import { Vec4 } from '../../util/Vec';

export default class HistoryManipulator extends Component {
	private button: Phaser.GameObjects.Sprite;

	constructor(scene: Phaser.Scene, x: number, y: number,
		private history: HistoryManager, private inputManager: InputManager) {
		super(scene, x, y);

		this.collision = new Vec4(0, 0, 38, 17);
		
		this.button = this.scene.add.sprite(0, 0, 'ui_history_manipulation');
		this.button.setOrigin(0);
		this.add(this.button);
	}

	update() {
		const collides = this.mouseCollides();
		const cursorPos = this.getCursorPos();
		
		if (this.history.hasNext() && this.history.hasPrev()) {
			if (collides && cursorPos.x > 19) {
				this.button.setFrame(2);
				if (this.inputManager.mouseLeftPressed()) this.history.redo();
			}
			else if (collides) {
				this.button.setFrame(5);
				if (this.inputManager.mouseLeftPressed()) this.history.undo();
			}
			else this.button.setFrame(1);
		}
		else if (!this.history.hasNext() && this.history.hasPrev()) {
			if (collides && cursorPos.x <= 19) {
				this.button.setFrame(7);
				if (this.inputManager.mouseLeftPressed()) this.history.undo();
			}
			else this.button.setFrame(3);
		}
		else if (this.history.hasNext() && !this.history.hasPrev()) {
			if (collides && cursorPos.x > 19) {
				this.button.setFrame(6);
				if (this.inputManager.mouseLeftPressed()) this.history.redo();
			}
			else this.button.setFrame(0);
		}
		else this.button.setFrame(4);
	}
}

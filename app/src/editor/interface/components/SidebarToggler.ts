import type * as Phaser from 'phaser';

import Component from './Component';

import type InterfaceRoot from '../InterfaceRoot';
import type InputManager from '../../InputManager';

export default class SidebarToggler extends Component {
	private button: Phaser.GameObjects.Sprite;

	constructor(scene: Phaser.Scene, x: number, y: number,
		private inputManager: InputManager, private interfaceRoot: InterfaceRoot) {
		super(scene, x, y);
		
		this.button = this.scene.add.sprite(0, 0, 'ui_sidebar_toggle');
		this.button.setOrigin(0);
		this.add(this.button);
	}

	update() {
		const collides = this.mouseCollides();
		const cursorPos = this.getCursorPos();

		if (collides && cursorPos.x >= 20) {
			this.button.setFrame(2 + (this.interfaceRoot.sidebarOpen ? 0 : 1));
			if (this.inputManager.mouseLeftPressed()) this.interfaceRoot.setSidebarOpen(false);
		}
		else this.button.setFrame(0 + (this.interfaceRoot.sidebarOpen ? 0 : 1));

		if (this.inputManager.keyPressed('F')) this.interfaceRoot.setSidebarOpen(false);
	}
}

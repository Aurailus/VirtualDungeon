import * as Phaser from 'phaser';

import Sidebar from './Sidebar';

import Token from '../../Token';
import TokenMode from '../../mode/TokenMode';
import ModeManager from '../../mode/ModeManager';
import type InputManager from '../../InputManager';

import { Asset } from '../../util/Asset';

export default class TokenSidebar extends Sidebar {
	spinTimer: number = 0;

	lastSelectedToken: number = 0;
	cursorMode: Phaser.GameObjects.Sprite;

	constructor(scene: Phaser.Scene, x: number, y: number, assets: Asset[],
		inputManager: InputManager, private mode: ModeManager) {
		super(scene, x, y, inputManager);

		this.cursorMode = this.scene.add.sprite(44, 1, 'ui_button_select_cursor');
		this.cursorMode.setOrigin(0);
		this.add(this.cursorMode);

		for (let token of assets.filter((a) => a.type === 'token'))
			this.addToken(token.identifier);
	}

	update() {
		super.update();

		// if (this.scene.token.selectedTokenType === '') this.cursorMode.setFrame(0);
		// else this.cursorMode.setFrame(2);
		
		// if (this.cursorMode.mouseIntersects()) {
		// 	this.cursorMode.setFrame(1);
		// 	if (this.scene.inputManager.mouseLeftPressed()) this.toggleSelectMode();
		// }

		if (this.inputManager.keyPressed('S')) this.toggleSelectMode();
	}

	toggleSelectMode() {
		if ((this.mode.active as TokenMode).placeTokenType) {
			(this.mode.active as TokenMode).placeTokenType = '';
			this.activeSpriteCursor.setVisible(false);
		}
		else {
			(this.mode.active as TokenMode).placeTokenType = this.elems[this.lastSelectedToken];
			this.activeSpriteCursor.setVisible(true);
		}

	}

	elemHover(x: number, y: number): void {
		let hoveredToken = this.sprites[x + (y - 1) * 3] as Token;
		
		this.spinTimer++;
		if (this.spinTimer > 20) {
			let frame = hoveredToken.getFrame() + 1;
			frame %= hoveredToken.frameCount();
			hoveredToken.setFrame(frame);
			this.spinTimer = 0;
		}
	}

	elemUnhover(): void {
		this.sprites.forEach(t => t.setFrame(0));
	}

	elemClick(x: number, y: number): void {
		this.lastSelectedToken = x + (y - 1) * 3;
		if ((this.mode.active as TokenMode).placeTokenType !== 'undefined')
			(this.mode.active as TokenMode).placeTokenType = this.elems[x + (y - 1) * 3];
	}

	addToken(sprite: string) {
		let p = this.elems.length;
		let x = p % 3;
		let y = Math.floor(p / 3) + 1;
		this.elems.push(sprite);

		if (x === 0) this.backgrounds[y].setFrame(0);

		let token = new Token(this.scene, 0, 0, sprite);
		token.setPosition(4 + x * 21, 4 + y * 21);
		token.setScale(16);

		this.sprites.push(token);
		this.list.push(token);

		this.bringToTop(this.activeSpriteCursor);
		this.bringToTop(this.hoverSpriteCursor);
	}
}

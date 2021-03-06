import * as Phaser from 'phaser';

import Sidebar from './Sidebar';

import Token from '../../map/token/Token';
import TokenMode from '../../mode/TokenMode';
import ModeManager from '../../mode/ModeManager';
import type InputManager from '../../interact/InputManager';

import { Vec2 } from '../../util/Vec';
import { Asset } from '../../../../../common/DBStructs';

export default class TokenSidebar extends Sidebar {
	spinTimer: number = 0;

	lastSelectedToken: number = 0;

	constructor(scene: Phaser.Scene, x: number, y: number, assets: Asset[],
		inputManager: InputManager, private mode: ModeManager) {
		super(scene, x, y, inputManager);

		for (let token of assets.filter((a) => a.type === 'token'))
			this.addToken(token.identifier);
	}

	update() {
		super.update();
		
		if (this.inputManager.keyPressed('S')) this.toggleSelectMode();
	}

	toggleSelectMode() {
		if ((this.mode.active as TokenMode).getPlaceToken?.()) {
			(this.mode.active as TokenMode).setPlaceToken?.();
			this.activeSpriteCursor.setVisible(false);
		}
		else {
			(this.mode.active as TokenMode).setPlaceToken?.(this.elems[this.lastSelectedToken]);
			this.activeSpriteCursor.setVisible(true);
		}
	}

	elemHover(x: number, y: number): void {
		let hoveredToken = this.sprites[x + (y - 1) * 3] as Token;
		
		this.spinTimer++;
		if (this.spinTimer > 20) {
			let index = hoveredToken.getFrameIndex() + 1;
			index %= hoveredToken.getFrameCount();
			hoveredToken.setIndex(index);
			this.spinTimer = 0;
		}
	}

	elemUnhover(): void {
		this.sprites.forEach(t => t.setIndex(0));
	}

	elemClick(x: number, y: number): void {
		this.lastSelectedToken = x + (y - 1) * 3;
		(this.mode.active as TokenMode).setPlaceToken?.(this.elems[x + (y - 1) * 3]);
	}

	addToken(sprite: string) {
		let p = this.elems.length;
		let x = p % 3;
		let y = Math.floor(p / 3) + 1;
		this.elems.push(sprite);

		if (x === 0) this.backgrounds[y].setFrame(0);

		let token = new Token(this.scene, '', 50, new Vec2(4 + x * 21, 4 + y * 21), 1, sprite);
		token.setScale(16);
		this.sprites.push(token);
		this.add(token);

		this.bringToTop(this.activeSpriteCursor);
		this.bringToTop(this.hoverSpriteCursor);
	}
}

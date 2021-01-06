import UISidebar from './UISidebar';
import UIComponent from './UIComponent';
import type MapScene from '../../scene/MapScene';

import Token from '../../Token';

export default class UITokenSidebar extends UISidebar {
	spinTimer: number = 0;

	lastSelectedToken: number = 0;
	cursorMode: UIComponent;

	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y);

		this.cursorMode = new UIComponent(scene, 15 - 2/3, 1, 'ui_button_select_cursor');
		this.add(this.cursorMode);
	}

	update() {
		super.update();

		if (this.scene.token.selectedTokenType === '') this.cursorMode.setFrame(0);
		else this.cursorMode.setFrame(2);
		
		if (this.cursorMode.mouseIntersects()) {
			this.cursorMode.setFrame(1);
			if (this.scene.i.mouseLeftPressed()) this.toggleSelectMode(this.scene.token.selectedTokenType !== '');
		}

		if (this.scene.i.keyPressed('S')) this.toggleSelectMode(this.scene.token.selectedTokenType !== '');
	}

	toggleSelectMode(select: boolean) {
		if (select) {
			this.scene.token.selectedTokenType = '';
			this.activeSpriteCursor.setVisible(false);
		}
		else {
			this.scene.token.selectedTokenType = this.elems[this.lastSelectedToken];
			this.activeSpriteCursor.setVisible(true);
		}

	}

	elemHover(x: number, y: number): void {
		let hoveredToken = this.sprites[x + y * 3] as Token;

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
		this.lastSelectedToken = x + y * 3;
		this.scene.token.selectedTokenType = this.elems[x + y * 3];
	}

	addToken(sprite: string) {
		let p = this.elems.length;
		let x = p % 3;
		let y = Math.floor(p / 3) + 1;
		this.elems.push(sprite);

		if (x === 0) this.backgrounds[y].setFrame(0);

		let token = new Token(this.scene, 0, 0, sprite);
		token.setPosition(12 + x * 21 * 3, 12 + y * 21 * 3);
		token.setScale(3 * 16);

		this.sprites.push(token);
		this.list.push(token);

		this.bringToTop(this.activeSpriteCursor);
		this.bringToTop(this.hoverSpriteCursor);
	}
}

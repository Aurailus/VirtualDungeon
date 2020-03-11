class UITokenSidebar extends UISidebar {
	
	spinTimer: number = 0;

	constructor(scene: MainScene, x: number, y: number) {
		super(scene, x, y);
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

	elemUnhover(x: number, y: number): void {
		this.sprites.forEach(t => t.setFrame(0));
	}

	elemClick(x: number, y: number): void {
		this.scene.activeToken = this.elems[x + y * 3];
	}

	addToken(sprite: string) {
		let p = this.elems.length;
		let x = p % 3;
		let y = Math.floor(p / 3);
		this.elems.push(sprite);

		if (x == 0) this.backgrounds[y].setFrame(0);

		let token = new Token(this.scene, 0, 0, sprite);
		Phaser.GameObjects.Sprite.prototype.setPosition.call(token, 12 + x * 21 * 3, 12 + y * 21 * 3);
		token.setScale(3 / 4);

		this.sprites.push(token);
		this.list.push(token);

		this.bringToTop(this.activeSpriteCursor);
		this.bringToTop(this.hoverSpriteCursor);
	}
}

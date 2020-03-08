class TokenMode {
	scene: MainScene;
	active: boolean = false;

	currentToken: Token | null = null;
	pointerDown: boolean = false;
	grabOffset: Vec2;
	startPosition: Vec2;

	constructor(scene: MainScene) {
		this.scene = scene;
	}

	update() {
		this.active = true;

		for (let token of this.scene.tokens) {
			if (this.scene.world.cursorWorld.x >= token.x && this.scene.world.cursorWorld.y >= token.y 
				&& this.scene.world.cursorWorld.x <= token.x + token.width && this.scene.world.cursorWorld.y <= token.y + token.height) {
				token.toggleOutline(true);

				if (this.scene.input.mousePointer.leftButtonDown() && !this.pointerDown && this.currentToken == null) {
					this.grabOffset = new Vec2(this.scene.world.cursorWorld.x - token.x, this.scene.world.cursorWorld.y - token.y); 
					this.startPosition = token.getPosition();
					this.currentToken = token;
					this.pointerDown = true;
				}
			}
			else token.toggleOutline(false);
		}

		if (!this.scene.input.mousePointer.leftButtonDown() && this.pointerDown && this.currentToken != null) {
			for (let token of this.scene.tokens) token.toggleOutline(false);

			if (this.currentToken.getPosition().x != this.startPosition.x || this.currentToken.getPosition().y != this.startPosition.y)
				this.scene.history.push("token_move", { start: this.startPosition, end: this.currentToken.getPosition(), token: this.currentToken });
			
			this.currentToken = null;
			this.pointerDown = false;
		}

		if (this.currentToken != null) {
			let pos = new Vec2(Math.round((this.scene.world.cursorWorld.x - this.grabOffset.x) / 4), 
				Math.round((this.scene.world.cursorWorld.y - this.grabOffset.y) / 4));

			if (!this.scene.snapKey.isDown) {
				pos.x = Math.round(pos.x / 16) * 16;
				pos.y = Math.round(pos.y / 16) * 16;
			}
			this.currentToken.setPosition(pos.x, pos.y);
		}
	}

	cleanup() {
		if (!this.active) return;
		this.active = false;

		for (let token of this.scene.tokens) {
			token.toggleOutline(false);
		}

		this.currentToken = null;
	}
}

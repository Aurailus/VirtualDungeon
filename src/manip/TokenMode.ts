class TokenMode {
	scene: MainScene;
	active: boolean = false;

	currentToken: Token | null = null;
	pointerDown: boolean = false;
	grabOffset: Vec2;
	startPosition: Vec2;
	currentSerialized: string = "";

	constructor(scene: MainScene) {
		this.scene = scene;

		this.onWheel = this.onWheel.bind(this);
		document.documentElement.addEventListener("wheel", this.onWheel);
		this.scene.events.on('destroy', () => document.documentElement.removeEventListener("wheel", this.onWheel));
	}

	onWheel(e: WheelEvent) {
		if (this.currentToken != null) {
			let dir = e.deltaY > 0 ? 1 : -1;

			let frame = this.currentToken.getFrame() + dir;
			if (frame < 0) frame += this.currentToken.frameCount();
			frame %= this.currentToken.frameCount();

			this.currentToken.setFrame(frame);
		}
	}

	update() {
		this.active = true;
		let foundToHighlight = false;

		for (let i = this.scene.tokens.length - 1; i >= 0; i--) {
			let token = this.scene.tokens[i];

			if (!foundToHighlight && this.scene.world.cursorWorld.x >= token.x && this.scene.world.cursorWorld.y >= token.y 
				&& this.scene.world.cursorWorld.x <= token.x + token.width && this.scene.world.cursorWorld.y <= token.y + token.height) {
				token.toggleOutline(true);
				foundToHighlight = true;

				if (this.scene.input.mousePointer.leftButtonDown() && !this.pointerDown && this.currentToken == null) {
					this.grabOffset = new Vec2(this.scene.world.cursorWorld.x - token.x, this.scene.world.cursorWorld.y - token.y); 
					this.startPosition = token.getPosition();
					this.currentToken = token;
					this.currentSerialized = this.currentToken.serialize();
					this.pointerDown = true;
				}
			}
			else if (this.currentToken != token) token.toggleOutline(false);
		}
		if (this.currentToken == null && this.scene.input.mousePointer.leftButtonDown()) {
			let token = new Token(this.scene, Math.floor(this.scene.world.cursorWorld.x / 4 / 16) * 16, 
				Math.floor(this.scene.world.cursorWorld.y / 4 / 16) * 16, this.scene.activeToken);
			this.scene.add.existing(token);
			this.scene.tokens.push(token);
			this.scene.history.push("token_create", { data: token.serialize() });
		}

		if (!this.scene.input.mousePointer.leftButtonDown() && this.pointerDown && this.currentToken != null) {
			for (let token of this.scene.tokens) if (token != this.currentToken) token.toggleOutline(false);

			if (JSON.stringify(this.currentToken.serialize()) != JSON.stringify(this.currentSerialized))
				this.scene.history.push("token_modify", { old: this.currentSerialized, new: this.currentToken.serialize() });
			
			this.currentToken = null;
			this.currentSerialized = "";
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

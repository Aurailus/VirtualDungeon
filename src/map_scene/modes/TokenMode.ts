class TokenMode {
	scene: MapScene;
	active: boolean = false;
	cursor: Phaser.GameObjects.Sprite;

	selectedTokenType: string = "";

	hoveredToken: Token | null = null;
	selectedToken: Token | null = null;

	grabOffset: Vec2;
	prevSerialized: string = "";
	movingToken: boolean = null;

	constructor(scene: MapScene) {
		this.scene = scene;

		this.onWheel = this.onWheel.bind(this);
		document.documentElement.addEventListener("wheel", this.onWheel);
		this.scene.events.on('destroy', () => document.documentElement.removeEventListener("wheel", this.onWheel));

		// Create cursor hover sprite
		this.cursor = this.scene.add.sprite(0, 0, "cursor");
		this.cursor.setScale(4, 4);
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);
	}

	onWheel(e: WheelEvent) {
		if (this.movingToken) {
			let dir = e.deltaY > 0 ? 1 : -1;

			let frame = this.selectedToken.getFrame() + dir;
			if (frame < 0) frame += this.selectedToken.frameCount();
			frame %= this.selectedToken.frameCount();

			this.selectedToken.setFrame(frame);
		}
	}

	update() {
		this.active = true;


		if (!this.movingToken) this.selecting();
		else this.moving();

		if (this.selectedToken != null && !this.movingToken) this.tokenMoveControls();
	}

	private tokenMoveControls(): void {
		if (this.scene.i.keyPressed('UP')) {
			this.moveToken(0, -16, 2);
		}
		if (this.scene.i.keyPressed('LEFT')) {
			this.moveToken(-16, 0, 1);
		}
		if (this.scene.i.keyPressed('DOWN')) {
			this.moveToken(0, 16, 0);
		}
		if (this.scene.i.keyPressed('RIGHT')) {
			this.moveToken(16, 0, 3);
		}
	}

	private moveToken(x: number, y: number, frame: number): void {
		this.prevSerialized = this.selectedToken.serialize();
		this.selectedToken.x += x * 4;
		this.selectedToken.y += y * 4;
		this.selectedToken.setFrame(frame);
		if (JSON.stringify(this.selectedToken.serialize()) != JSON.stringify(this.prevSerialized))
			this.scene.history.push("token_modify", { old: this.prevSerialized, new: this.selectedToken.serialize() });
	}

	private selecting(): void {
		const cursor = this.scene.world.cursorWorld;

		// Find the currently hovered token, and remove all outlines. 
		this.hoveredToken = null;

		for (let i = this.scene.tokens.length - 1; i >= 0; i--) {
			let token = this.scene.tokens[i];
			if (cursor.x >= token.x && cursor.y >= token.y && cursor.x <= token.x + token.width && cursor.y <= token.y + token.height) {
				this.hoveredToken = token;
				break;
			}
		}
		
		// Apply outline to hovered token, remove it from non-hovered tokens
		for (let token of this.scene.tokens) if (token != this.hoveredToken) token.setHovered(false);
		if (this.hoveredToken != null) this.hoveredToken.setHovered(true);

		// Make cursor visible
		this.cursor.setVisible(this.hoveredToken == null);
		let selectedTilePos = new Vec2(Math.floor(this.scene.world.cursorWorld.x / 64), Math.floor(this.scene.world.cursorWorld.y / 64))
		this.cursor.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);

		// Left mouse interaction
		if (this.scene.i.mouseLeftPressed()) {
			if (this.selectedToken != null && this.hoveredToken == this.selectedToken) {
				// Start moving token if clicking on selected token.
				this.startMovingToken();
			}
			else if (this.selectedToken != null && this.hoveredToken != this.selectedToken) {
				// Deselect selected token and select hovered token if it exists.
				this.selectedToken.setSelected(false);
				this.selectedToken = null;
			}

			if (this.selectedToken == null) {
				if (this.hoveredToken != null) {
					// Change selection
					this.hoveredToken.setSelected(true);
					this.selectedToken = this.hoveredToken;
					this.startMovingToken();
				}
				else if (this.selectedTokenType != "") {
					// Place token
					let token = this.createToken();
					this.selectedToken = token;
					this.selectedToken.setSelected(true);
					this.startMovingToken();
				}
			}
		}
	}

	private moving(): void {
		const cursor = this.scene.world.cursorWorld;
		this.cursor.setVisible(false);

		if (this.selectedToken != null) {
			let pos = new Vec2(Math.round(cursor.x / 4), Math.round(cursor.y / 4));

			if (this.scene.i.keyDown('shift')) { 
				pos = new Vec2(Math.round((cursor.x - this.grabOffset.x) / 4), Math.round((cursor.y - this.grabOffset.y) / 4));
			}
			else {
				pos.x = Math.round((pos.x - this.selectedToken.sprite.width / 2) / 16) * 16;
				pos.y = Math.round((pos.y - this.selectedToken.sprite.height / 2) / 16) * 16;
			}

			this.selectedToken.setPosition(pos.x, pos.y);

			if (!this.scene.i.mouseLeftDown()) {
				this.movingToken = false;

				if (JSON.stringify(this.selectedToken.serialize()) != JSON.stringify(this.prevSerialized))
					this.scene.history.push("token_modify", { old: this.prevSerialized, new: this.selectedToken.serialize() });
			}
		}
	}

	startMovingToken(): void {
		this.movingToken = true;
		const cursor = this.scene.world.cursorWorld;

		this.grabOffset = new Vec2(cursor.x - this.selectedToken.x, cursor.y - this.selectedToken.y); 
		this.prevSerialized = this.selectedToken.serialize();
	}

	createToken(): Token {
			let token = new Token(this.scene, Math.floor(this.scene.world.cursorWorld.x / 4 / 16) * 16, 
				Math.floor(this.scene.world.cursorWorld.y / 4 / 16) * 16, this.selectedTokenType);

			this.scene.add.existing(token);
			this.scene.tokens.push(token);
			this.scene.history.push("token_create", { data: token.serialize() });

			return token;
	}

	cleanup() {
		if (!this.active) return;
		this.active = false;

		if (this.selectedToken != null) this.selectedToken.setSelected(false);
		if (this.hoveredToken != null) this.hoveredToken.setHovered(false);
		this.selectedToken = null;
		this.hoveredToken = null;

		this.movingToken = false;

		this.cursor.setVisible(false);
	}
}

class TokenMode {
	scene: MapScene;
	active: boolean = false;

	primitives: Phaser.GameObjects.Line[] = [];
	cursor?: Phaser.GameObjects.Sprite;
	tokenPreview?: Token;

	selectedTokenType: string = "";

	hoveredToken: Token | null = null;
	selectedTokens: Token[] = [];
	clickedLastFrame: boolean = false;

	tileGrabPos: Vec2 = new Vec2();
	startTilePos: Vec2 | null = null;

	prevSerialized: string[] = [];
	movingTokens: boolean = false;
	movedTokens: boolean = false;

	constructor(scene: MapScene) {
		this.scene = scene;
	}

	init() {
		// Create cursor hover sprite
		this.cursor = this.scene.add.sprite(0, 0, "cursor");
		this.cursor.setScale(4, 4);
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);
		this.cursor.setVisible(false);

		// Create token preview sprite
		this.tokenPreview = new Token(this.scene, 0, 0, "");
		this.scene.add.existing(this.tokenPreview);
		this.tokenPreview.setVisible(false);
		this.tokenPreview.setAlpha(0.2);

		// Add scrolling capture
		this.onWheel = this.onWheel.bind(this);
		document.documentElement.addEventListener("wheel", this.onWheel);
		this.scene.events.on('destroy', () => document.documentElement.removeEventListener("wheel", this.onWheel));
	}

	onWheel(e: WheelEvent) {
		if (this.movingTokens) {
			let dir = e.deltaY > 0 ? 1 : -1;

			this.selectedTokens.forEach((token) => {
				let frame = token.getFrame() + dir;
				if (frame < 0) frame += token.frameCount();
				frame %= token.frameCount();
				token.setFrame(frame);
			});
		}
	}

	update() {
		this.active = true;

		let selectedTilePos = new Vec2(Math.floor(this.scene.view.cursorWorld.x / 64), Math.floor(this.scene.view.cursorWorld.y / 64));

		if (this.movingTokens) this.moving();
		if (!this.movingTokens) this.selecting();

		if (this.selectedTokens.length > 0 && !this.movingTokens) this.tokenMoveControls();

		this.tokenPreview!.setPosition(selectedTilePos.x * 16, selectedTilePos.y * 16);
		this.cursor!.setPosition(selectedTilePos.x * 64, selectedTilePos.y * 64);

		if (this.selectedTokenType == "") this.tokenPreview!.setVisible(false);
		if (this.selectedTokenType != "") this.cursor!.setVisible(false);

		if (this.selectedTokenType != "") this.tokenPreview!.setVisible(this.hoveredToken == null);
		if (this.selectedTokenType == "") this.cursor!.setVisible(this.hoveredToken == null);

		if (this.tokenPreview!.sprite && this.tokenPreview!.sprite.texture.key != this.selectedTokenType)
			this.tokenPreview!.setTexture(this.selectedTokenType);
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

	private selectedIncludes(t: Token | null): boolean {
		if (!t) return false;
		for (let token of this.selectedTokens) {
			if (token == t) return true;
		}
		return false;
	}

	private moveToken(x: number, y: number, frame: number): void {
		let prevSerialized: string[] = [];
		this.selectedTokens.forEach((token) => {
			prevSerialized.push(token.serialize());
			token.x += x * 4;
			token.y += y * 4;
			token.setFrame(frame);
		});

		let identical = true;
		let currSerialized: string[] = [];
		for (let s = 0; s < prevSerialized.length; s++) {
			currSerialized.push(this.selectedTokens[s].serialize());
			if (prevSerialized[s] != currSerialized[s]) identical = false;
		}
		
		if (!identical) {
			this.scene.history.push("token_modify", { old: prevSerialized, new: currSerialized });
		}
	}

	private selecting(): void {
		const cursor = this.scene.view.cursorWorld;
		let clickedAddedThisFrame = false;

		// Find the currently hovered token, and remove all outlines. 
		this.hoveredToken = null;

		for (let i = this.scene.tokens.length - 1; i >= 0; i--) {
			let token = this.scene.tokens[i];
			if (cursor.x >= token.x && cursor.y >= token.y && cursor.x <= token.x + token.width - 8 && cursor.y <= token.y + token.height - 8) {
				this.hoveredToken = token;
				break;
			}
		}
		
		// Apply outline to hovered token, remove it from non-hovered tokens
		for (let token of this.scene.tokens) if (token != this.hoveredToken) token.setHovered(false);
		if (this.hoveredToken != null) this.hoveredToken.setHovered(true);
		
		if (this.scene.i.mouseLeftPressed()) {
			// Start moving if left pressed down on selected token
			if (this.selectedIncludes(this.hoveredToken)) {
				this.startMovingTokens();
			}
			else if (this.hoveredToken == null) {
				// Create a new token and move
				if (this.selectedTokenType != "") {
					let token = this.createToken();

					if (this.scene.i.keyDown('CTRL')) {
						if (!this.selectedIncludes(token)) this.selectedTokens.push(token);
					}
					else {
						this.selectedTokens.forEach(t => t.setSelected(false));
						this.selectedTokens = [token];
					}

					this.clickedLastFrame = true;
					clickedAddedThisFrame = true;

					token.setSelected(true);
					this.startMovingTokens();
				}
				// Start a rectangle selection
				else {
					this.startTilePos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
				}
			}
			// Selecting existing token to move
			else if (this.hoveredToken != null) {
				if (this.scene.i.keyDown('CTRL')) {
					this.clickedLastFrame = true;
					clickedAddedThisFrame = true;
					if (!this.selectedIncludes(this.hoveredToken)) this.selectedTokens.push(this.hoveredToken);
					this.hoveredToken.setSelected(true);
					this.startMovingTokens();
				}
				else {
					this.selectedTokens.forEach(t => t.setSelected(false));
					this.selectedTokens = [this.hoveredToken];
					this.clickedLastFrame = true;
					clickedAddedThisFrame = true;
					this.hoveredToken.setSelected(true);
					this.startMovingTokens();
				}
			}
		}

		if (this.scene.i.mouseLeftReleased()) {
			// Deselect current token if CTRL is down, or deselect all and select current token.
			if (this.startTilePos != null) {
				this.primitives.forEach((v) => v.destroy());
				this.primitives = [];

				let selectedTilePos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));

				let a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
				let b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));


				if (!this.scene.i.keyDown('CTRL')) {
					for (let s of this.selectedTokens) s.setSelected(false);
					this.selectedTokens = [];
				}

				for (let token of this.scene.tokens) {
					let tokenTilePos = new Vec2(Math.floor(token.x / 64), Math.floor(token.y / 64));

					if (tokenTilePos.x >= a.x && tokenTilePos.y >= a.y && tokenTilePos.x <= b.x && tokenTilePos.y <= b.y) {
						let selected = this.scene.i.keyDown('CTRL') ? !this.selectedIncludes(token) : true;
						token.setSelected(selected);
						if (selected && !this.selectedIncludes(token)) this.selectedTokens.push(token);
						else if (!selected && this.selectedIncludes(token)) {
							for (let i = 0; i < this.selectedTokens.length; i++) {
								if (this.selectedTokens[i] == token) this.selectedTokens.splice(i, 1);
							}
						}
					}
				}

				this.startTilePos = null;
				this.clickedLastFrame = true;
				clickedAddedThisFrame = true;
			}
			else if (!this.movedTokens && !this.clickedLastFrame && this.selectedIncludes(this.hoveredToken)) {
				if (this.scene.i.keyDown('CTRL')) {
					for (let i = 0; i < this.selectedTokens.length; i++) {
						if (this.selectedTokens[i] == this.hoveredToken) {
							this.selectedTokens[i].setSelected(false);
							this.selectedTokens.splice(i, 1);
							break;
						}
					}
				}
				else {
					this.selectedTokens.forEach(t => t.setSelected(false));
					this.selectedTokens = [this.hoveredToken!];
					this.hoveredToken!.setSelected(true);
					this.startMovingTokens();
				}
			}

			this.movedTokens = false;
		}

		if (this.scene.i.keyDown('DELETE') && this.selectedTokens.length > 0) {
			let serializedData: string[] = [];
			this.selectedTokens.forEach(t => {
				for (let i = 0; i < this.scene.tokens.length; i++) {
					if (this.scene.tokens[i] == t) {
						this.scene.tokens.splice(i, 1);
						break;
					}
				}
				serializedData.push(t.serialize());
				if (this.hoveredToken == t) this.hoveredToken = null;
				t.destroy();
			});
			this.selectedTokens = [];

			this.scene.history.push("token_delete", { data: serializedData });
		}

		if (!clickedAddedThisFrame) this.clickedLastFrame = false;

		if (this.scene.i.mouseLeftDown()) this.updateRectangleSelect();
	}

	updateRectangleSelect() {
		const cursor = this.scene.view.cursorWorld;
		let selectedTilePos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));

		this.primitives.forEach((v) => v.destroy());
		this.primitives = [];

		if (this.startTilePos != null) {
			let a = new Vec2(Math.min(this.startTilePos.x, selectedTilePos.x), Math.min(this.startTilePos.y, selectedTilePos.y));
			let b = new Vec2(Math.max(this.startTilePos.x, selectedTilePos.x), Math.max(this.startTilePos.y, selectedTilePos.y));

			const fac = 0.03;
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac, b.x + 1 - fac, a.y + fac, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac / 2, a.x + fac, b.y + 1 - fac / 2, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, a.x + fac, b.y + 1 - fac, b.x + 1 - fac, b.y + 1 - fac, 0xffffff, 1));
			this.primitives.push(this.scene.add.line(0, 0, b.x + 1 - fac, a.y + fac / 2, b.x + 1 - fac, b.y + 1 - fac / 2, 0xffffff, 1));

			this.primitives.forEach((v) => {
				v.setOrigin(0, 0);
				v.setScale(64, 64);
				v.setLineWidth(0.03);
				v.setDepth(300);
			});
		}
	}

	private moving(): void {
		this.cursor!.setVisible(false);
		const cursor = this.scene.view.cursorWorld;

		if (this.selectedTokens.length > 0) {
			if (!this.scene.i.mouseLeftDown()) {
				this.movingTokens = false;

				let identical = true;
				let currSerialized: string[] = [];
				for (let s = 0; s < this.selectedTokens.length; s++) {
					currSerialized.push(this.selectedTokens[s].serialize());
					if (this.prevSerialized[s] != currSerialized[s]) identical = false;
				}				
				if (!identical) {
					this.scene.history.push("token_modify", { old: this.prevSerialized, new: currSerialized });
				}
				return;
			}
			
			let newTileGrabPos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64));
			let offset = new Vec2(newTileGrabPos.x - this.tileGrabPos.x, newTileGrabPos.y - this.tileGrabPos.y);
			if (offset.x == 0 && offset.y == 0) return;
			this.movedTokens = true;
			this.tileGrabPos = newTileGrabPos;

			this.selectedTokens.forEach(tkn => tkn.setPosition(tkn.x / 4 + offset.x * 16, tkn.y / 4 + offset.y * 16));
		}
	}

	startMovingTokens(): void {
		this.movedTokens = false;
		this.movingTokens = true;
		const cursor = this.scene.view.cursorWorld;

		this.tileGrabPos = new Vec2(Math.floor(cursor.x / 64), Math.floor(cursor.y / 64)); 
		this.prevSerialized = [];
		this.selectedTokens.forEach(t => this.prevSerialized.push(t.serialize()));
	}

	createToken(): Token {
			let token = new Token(this.scene, Math.floor(this.scene.view.cursorWorld.x / 4 / 16) * 16, 
				Math.floor(this.scene.view.cursorWorld.y / 4 / 16) * 16, this.selectedTokenType);

			this.scene.add.existing(token);
			this.scene.tokens.push(token);
			this.scene.history.push("token_create", { data: token.serialize() });

			return token;
	}

	removeToken(t: Token) {
		for (let i = 0; i < this.selectedTokens.length; i++) if (this.selectedTokens[i] == t) this.selectedTokens.splice(i, 1);
		for (let i = 0; i < this.scene.tokens.length; i++) if (this.scene.tokens[i] == t) this.scene.tokens.splice(i, 1);
		if (this.scene.token.hoveredToken == t) this.scene.token.hoveredToken = null;

		t.destroy();
	}

	cleanup() {
		if (!this.active) return;
		this.active = false;

		this.selectedTokens.forEach(t => t.setSelected(false));
		this.selectedTokens = [];
		if (this.hoveredToken != null) this.hoveredToken.setHovered(false);
		this.hoveredToken = null;
		this.primitives.forEach(e => e.destroy());
		this.primitives = [];
		this.cursor!.setVisible(false);
		this.tokenPreview!.setVisible(false);
		this.movingTokens = false;
	}
}

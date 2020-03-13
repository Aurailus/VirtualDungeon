class InputManager {
	scene: Phaser.Scene;

	private leftMouseState: boolean = false;
	private rightMouseState: boolean = false;
	private leftMouseStateLast: boolean = false;
	private rightMouseStateLast: boolean = false;

	private keys: {[key: string]: Phaser.Input.Keyboard.Key} = {};
	private keysDown: {[key: string]: boolean } = {};
	private keysDownLast: {[key: string]: boolean } = {};

	constructor(scene: Phaser.Scene) {
		this.scene = scene;

		this.keys.TAB   = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
		this.keys.SHIFT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
		this.keys.CTRL  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
		this.keys.UP    = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.keys.DOWN  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		this.keys.LEFT  = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.keys.RIGHT = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

		for (let i = 0; i < 26; i++) {
			let letter = (i + 10).toString(36).toUpperCase();
			this.keys[letter] = scene.input.keyboard.addKey(letter);
		}

		for (let i = 0; i <= 9; i++) {
			this.keys[i+""] = scene.input.keyboard.addKey(i+"");
		}

		for (let key in this.keys) {
			this.keysDown[key] = false;
			this.keysDownLast[key] = false;
		}
	}

	update() {
		this.leftMouseStateLast = this.leftMouseState;
		this.leftMouseState = this.scene.input.mousePointer.leftButtonDown();
		this.rightMouseStateLast = this.rightMouseState;
		this.rightMouseState = this.scene.input.mousePointer.rightButtonDown();

		for (let key in this.keys) this.keysDownLast[key] = this.keysDown[key];
		for (let key in this.keys) this.keysDown[key] = this.keys[key].isDown;
	}

	mouseDown(): boolean {
		return this.leftMouseState || this.rightMouseState;
	}

	mousePressed(): boolean {
		return (this.leftMouseState && !this.leftMouseStateLast) || (this.rightMouseState && !this.rightMouseStateLast);
	}

	mouseReleased(): boolean {
		return (!this.leftMouseState && this.leftMouseStateLast) || (!this.rightMouseState && this.rightMouseStateLast);
	}

	mouseLeftDown(): boolean {
		return this.leftMouseState;
	}

	mouseLeftPressed(): boolean {
		return this.leftMouseState && !this.leftMouseStateLast;
	}

	mouseLeftReleased(): boolean {
		return !this.leftMouseState && this.leftMouseStateLast;
	}

	mouseRightDown(): boolean {
		return this.rightMouseState;
	}

	mouseRightPressed(): boolean {
		return this.rightMouseState && !this.rightMouseStateLast;
	}

	mouseRightReleased(): boolean {
		return !this.rightMouseState && this.rightMouseStateLast;
	}

	keyDown(key: string): boolean {
		return this.keysDown[key.toUpperCase()];
	}

	keyPressed(key: string): boolean {
		return this.keysDown[key.toUpperCase()] && !this.keysDownLast[key.toUpperCase()];
	}

	keyReleased(key: string): boolean {
		return !this.keysDown[key.toUpperCase()] && this.keysDownLast[key.toUpperCase()];
	}
}

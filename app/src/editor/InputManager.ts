type ScrollEvent = ((delta: number) => void);

export default class InputManager {
	scene: Phaser.Scene;

	private hasFocus: boolean = true;

	private leftMouseState: boolean = false;
	private rightMouseState: boolean = false;
	// private middleMouseState: boolean = false;
	private leftMouseStateLast: boolean = false;
	private rightMouseStateLast: boolean = false;
	// private middleMouseStateLast: boolean = false;
	
	private keys: {[key: string]: Phaser.Input.Keyboard.Key} = {};
	private keysDown: {[key: string]: boolean } = {};
	private keysDownLast: {[key: string]: boolean } = {};

	private scrollEvents: ScrollEvent[] = [];

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	init() {
		this.keys.TAB    = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
		this.keys.SHIFT  = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
		this.keys.CTRL   = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL);
		this.keys.UP     = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
		this.keys.DOWN   = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
		this.keys.LEFT   = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
		this.keys.RIGHT  = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
		this.keys.DELETE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE);

		for (let i = 0; i < 26; i++) {
			let letter = (i + 10).toString(36).toUpperCase();
			this.keys[letter] = this.scene.input.keyboard.addKey(letter);
		}

		for (let i = 0; i <= 9; i++) {
			this.keys[i + ''] = this.scene.input.keyboard.addKey(i + '');
		}

		for (let key of Object.keys(this.keys)) {
			this.keysDown[key] = false;
			this.keysDownLast[key] = false;
		}

		this.onScroll = this.onScroll.bind(this);
		document.documentElement.addEventListener('wheel', this.onScroll);
		this.scene.events.on('destroy', () => document.documentElement.removeEventListener('wheel', this.onScroll));
	}

	update() {
		this.leftMouseStateLast   = this.leftMouseState;
		this.leftMouseState 		  = this.scene.input.activePointer.leftButtonDown();
		this.rightMouseStateLast  = this.rightMouseState;
		this.rightMouseState 		  = this.scene.input.activePointer.rightButtonDown();
		// this.middleMouseStateLast = this.middleMouseState;
		// this.middleMouseState 		= this.scene.input.activePointer.middleButtonDown();

		for (let key of Object.keys(this.keys)) this.keysDownLast[key] = this.keysDown[key];
		for (let key of Object.keys(this.keys)) this.keysDown[key] = this.keys[key].isDown;
	}

	setFocus(focus: boolean) {
		if (this.hasFocus !== focus) {
			if (focus) this.scene.input.keyboard.enableGlobalCapture();
			else this.scene.input.keyboard.disableGlobalCapture();
		}
		this.hasFocus = focus;
	}

	mouseDown(): boolean {
		if (!this.hasFocus) return false;
		return this.leftMouseState || this.rightMouseState;
	}

	mousePressed(): boolean {
		if (!this.hasFocus) return false;
		return (this.leftMouseState && !this.leftMouseStateLast) || (this.rightMouseState && !this.rightMouseStateLast);
	}

	mouseReleased(): boolean {
		if (!this.hasFocus) return false;
		return (!this.leftMouseState && this.leftMouseStateLast) || (!this.rightMouseState && this.rightMouseStateLast);
	}

	mouseLeftDown(): boolean {
		if (!this.hasFocus) return false;
		return this.leftMouseState;
	}

	mouseLeftPressed(): boolean {
		if (!this.hasFocus) return false;
		return this.leftMouseState && !this.leftMouseStateLast;
	}

	mouseLeftReleased(): boolean {
		if (!this.hasFocus) return false;
		return !this.leftMouseState && this.leftMouseStateLast;
	}

	mouseRightDown(): boolean {
		if (!this.hasFocus) return false;
		return this.rightMouseState;
	}

	mouseRightPressed(): boolean {
		if (!this.hasFocus) return false;
		return this.rightMouseState && !this.rightMouseStateLast;
	}

	mouseRightReleased(): boolean {
		if (!this.hasFocus) return false;
		return !this.rightMouseState && this.rightMouseStateLast;
	}

	keyDown(key: string): boolean {
		if (!this.hasFocus) return false;
		return this.keysDown[key.toUpperCase()];
	}

	keyPressed(key: string): boolean {
		if (!this.hasFocus) return false;
		return this.keysDown[key.toUpperCase()] && !this.keysDownLast[key.toUpperCase()];
	}

	keyReleased(key: string): boolean {
		if (!this.hasFocus) return false;
		return !this.keysDown[key.toUpperCase()] && this.keysDownLast[key.toUpperCase()];
	}

	bindScrollEvent(evt: ScrollEvent): void {
		this.scrollEvents.push(evt);
	}

	private onScroll(e: WheelEvent) {
		if (!this.hasFocus) return;
		let delta = e.deltaY < 0 ? 1 : -1;
		for (let evt of this.scrollEvents) evt(delta);
	}
}

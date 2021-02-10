import { Vec2 } from '../util/Vec';

export type Context = 'map' | 'interface';

type ScrollEvent = ((delta: number) => boolean | void);

export default class InputManager {
	private context: Context = 'map';

	private leftMouseState: boolean = false;
	private rightMouseState: boolean = false;
	private middleMouseState: boolean = false;
	private leftMouseStateLast: boolean = false;
	private rightMouseStateLast: boolean = false;
	private middleMouseStateLast: boolean = false;

	private mousePos: Vec2 = new Vec2(0, 0);
	private scrollEvents: ScrollEvent[] = [];
	
	private keys: {[key: string]: Phaser.Input.Keyboard.Key} = {};
	private keysDown: {[key: string]: boolean } = {};
	private keysDownLast: {[key: string]: boolean } = {};

	private focus: boolean = true;

	constructor(private scene: Phaser.Scene) {}

	init() {
		this.keys.TAB    = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB, false);
		this.keys.SPACE  = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, false);

		this.keys.ALT    = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ALT, false);
		this.keys.CTRL   = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL, false);
		this.keys.SHIFT  = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT, false);
		
		this.keys.UP     = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, false);
		this.keys.DOWN   = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, false);
		this.keys.LEFT   = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, false);
		this.keys.RIGHT  = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, false);
		
		this.keys.DELETE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE, false);

		for (let i = 0; i < 26; i++) {
			let letter = (i + 10).toString(36).toUpperCase();
			this.keys[letter] = this.scene.input.keyboard.addKey(letter, false);
		}

		for (let i = 0; i <= 9; i++) {
			this.keys[i + ''] = this.scene.input.keyboard.addKey(i + '', false);
		}

		for (let i = 0; i <= 9; i++) {
			this.keys['F' + i] = this.scene.input.keyboard.addKey('F' + i);
		}

		for (let key of Object.keys(this.keys)) {
			this.keysDown[key] = false;
			this.keysDownLast[key] = false;
		}

		window.addEventListener('keydown', (evt: KeyboardEvent) => {
			if (evt.key !== 'Tab' || evt.target !== document.body) return;
			evt.preventDefault();
			evt.stopPropagation();
		});
		

		window.addEventListener('mousemove', (evt: MouseEvent) => {
			this.mousePos = new Vec2(evt.x, evt.y);
		});

		const updateKeys = () => {
			Object.values(this.keys).forEach(k => k.enabled = this.focus);
		};

		// window.addEventListener('focusin', (evt: FocusEvent) => {
		// 	console.log('focus', evt.target);
		// 	this.focus = evt.target === document.body;
		// 	updateKeys();
		// });

		window.addEventListener('mousedown', e => {
			const target = e.target as any;
			this.focus = target === this.scene.game.canvas;
			if (this.focus) (document.activeElement as any)?.blur();
			updateKeys();
		});

		this.onScroll = this.onScroll.bind(this);
		document.documentElement.addEventListener('wheel', this.onScroll);
		this.scene.events.on('destroy', () => document.documentElement.removeEventListener('wheel', this.onScroll));
	}

	update() {
		this.leftMouseStateLast   = this.leftMouseState;
		this.leftMouseState 		  = this.focus && this.scene.input.activePointer.leftButtonDown();
		this.rightMouseStateLast  = this.rightMouseState;
		this.rightMouseState 		  = this.focus && this.scene.input.activePointer.rightButtonDown();
		this.middleMouseStateLast = this.middleMouseState;
		this.middleMouseState 		= this.focus && this.scene.input.activePointer.middleButtonDown();

		for (let key of Object.keys(this.keys)) this.keysDownLast[key] = this.keysDown[key];
		for (let key of Object.keys(this.keys)) this.keysDown[key] = this.keys[key].isDown;
	}

	getContext(): Context {
		return this.context;
	}

	setContext(context: Context) {
		this.context = context;
	}

	getMousePos(): Vec2 {
		return new Vec2(this.mousePos);
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

	mouseMiddleDown(): boolean {
		return this.middleMouseState;
	}

	mouseMiddlePressed(): boolean {
		return this.middleMouseState && !this.middleMouseStateLast;
	}

	mouseMiddleReleased(): boolean {
		return !this.middleMouseState && this.middleMouseStateLast;
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

	bindScrollEvent(evt: ScrollEvent): void {
		this.scrollEvents.unshift(evt);
	}

	private onScroll(e: WheelEvent) {
		let delta = e.deltaY < 0 ? 1 : -1;
		for (let evt of this.scrollEvents) {
			if (evt(delta)) return;
		}
	}
}

import EventHandler from '../../EventHandler';

import { generateId } from '../../util/Helpers';

/** Data pretaining to a token slider. */
export interface TokenSliderData {
	name: string;
	color?: string;
	icon?: number;

	min?: number;
	max: number;
	current: number;
}

/** Data pretaining to a token. */
export interface TokenData {
	uuid: string;
	
	pos: { x: number; y: number };
	appearance: { sprite: string; index: number };

	name: string;
	note: string;
	
	sliders: TokenSliderData[];
	
	pinned: boolean;
}

/** Default token data, for raw assignment. */
const DEFAULT_TOKEN_DATA: Omit<TokenData, 'uuid'> = {
	pos: { x: 0, y: 0 },
	appearance: { sprite: '', index: 0 },
	
	name: '',

	note: '',
	sliders: [],

	pinned: false
};

/** Event emitted when a token data is modified. */
export interface TokenModifyEvent {
	token: Token;
	pre: TokenData;
	post: TokenData;
}

/**
 * Represents a token in the world, its properties are determined by its TokenData,
 * which can be set, updated, and retrieved through public methods.
 */

export default class Token extends Phaser.GameObjects.Container {
	readonly change = new EventHandler<TokenModifyEvent>();
	
	private sprite: Phaser.GameObjects.Sprite;
	private shadow: Phaser.GameObjects.Sprite;

	private tokenData: TokenData;
	
	private hovered: boolean = false;
	private selected: boolean = false;

	constructor(scene: Phaser.Scene, tokenData?: Partial<TokenData>) {
		super(scene, 0, 0);

		this.tokenData = { ...DEFAULT_TOKEN_DATA, uuid: '' };
		this.setToken({
			...DEFAULT_TOKEN_DATA,
			...tokenData ?? {},
			uuid: tokenData?.uuid ?? generateId(32)
		});

		this.shadow = new Phaser.GameObjects.Sprite(this.scene, -1 / 16, -1 / 16, '');
		this.shadow.setOrigin(0, 0);
		this.shadow.setScale(18 / 16 / this.shadow.width, 18 / 16 / 4 / this.shadow.height);
		this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
		this.shadow.setTint(0x000000);
		this.list.push(this.shadow);

		this.sprite = new Phaser.GameObjects.Sprite(this.scene, -1 / 16, -1 / 16, '');
		this.sprite.setOrigin(0, 0);
		this.sprite.setScale(18 / 16 / this.sprite.width, 18 / 16 / this.sprite.height);
		this.setPosition(this.x, this.y);
		this.list.push(this.sprite);

		this.updateAppearance();
	}

	setToken(data: Partial<TokenData>) {
		if (!this.tokenData) return;

		const preSer = JSON.stringify(this.tokenData);
		const postSer = JSON.stringify({ ...this.tokenData, ...data });
		
		if (preSer === postSer) return;

		const pre = JSON.parse(preSer);
		const post = JSON.parse(postSer);

		this.tokenData = post;
		this.updateAppearance();

		this.change.dispatch({ token: this, pre, post });
	}

	getToken(): TokenData {
		return JSON.parse(JSON.stringify(this.tokenData));
	}

	getUUID(): string {
		return this.tokenData.uuid;
	}

	getFrame(): number {
		return this.tokenData.appearance.index;
	}

	getFrameCount(): number {
		return Object.keys(this.sprite.texture.frames).length - 1;
	}

	setSelected(selected: boolean) {
		this.selected = selected;
		this.updateShader();
	}

	setHovered(hovered: boolean) {
		this.hovered = hovered;
		this.updateShader();
	}

	setPosition(x?: number, y?: number): this {
		if (!this.tokenData) return this;
		this.setToken({ pos: { x: x ?? 0, y: y ?? x ?? 0 }});
		return this;
	}

	private updateAppearance() {
		// console.log(this.tokenData);
		Phaser.GameObjects.Container.prototype.setPosition.call(this, this.tokenData.pos.x, this.tokenData.pos.y);
		if (!this.sprite || !this.shadow) return;

		this.sprite.setTexture(this.tokenData.appearance.sprite);
		this.sprite.setFrame(this.tokenData.appearance.index);
		this.shadow.setTexture(this.tokenData.appearance.sprite);
		this.shadow.setFrame(this.tokenData.appearance.index);

		this.shadow.setScale(18 / 16 / this.shadow.width, 18 / 16 / 4 / this.shadow.height);
		this.sprite.setScale(18 / 16 / this.sprite.width, 18 / 16 / this.sprite.height);

		this.shadow.y = this.sprite.displayHeight - this.shadow.displayHeight - 0.125;
	}

	private updateShader() {
		if (this.selected) {
			this.sprite.setPipeline('outline');
			this.sprite.pipeline.set1f('tex_size', this.sprite.texture.source[0].width);
		}
		else if (this.hovered) {
			this.sprite.setPipeline('brighten');
		}
		else this.sprite.resetPipeline();
	}
}

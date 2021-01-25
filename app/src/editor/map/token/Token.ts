import EventHandler from '../../EventHandler';

import { Vec2 } from '../../util/Vec';
import { generateId } from '../../util/Helpers';


/**
 * Represents a slider bar for a token.
 */

export interface TokenSliderData {
	name: string;
	color?: string;
	icon?: number;

	min?: number;
	max: number;
	current: number;
}


/**
 * The meta information (name, sliders, note) for a token.
 */

export interface TokenMetaData {
	uuid: string;

	name: string;
	note: string;
	
	sliders: TokenSliderData[];
}


/**
 * The render information for a token, such as position and sprite.
 */

export interface TokenRenderData {
	uuid: string;

	pos: { x: number; y: number };
	appearance: { sprite: string; index: number };
}


/**
 * Full token data, for serialization or info passing.
 */

export interface TokenData {
	uuid: string;
	render: Omit<TokenRenderData, 'uuid'>;
	meta: Omit<TokenMetaData, 'uuid'>;
}


/**
 * Event object emitted when a token's meta data is modified.
 */

export interface TokenMetaEvent {
	token: Token;
	pre: TokenMetaData;
	post: TokenMetaData;
}


/**
 * Event object emitted when a token's texture changes, or it is moved.
 */

export interface TokenRenderEvent {
	token: Token;
	pos: { pre: Vec2; post: Vec2 };
	appearance: { pre: { sprite: string; index: number }; post: { sprite: string; index: number }};
}


/**
 * Default token meta data.
 */

const DEFAULT_TOKEN_META: Omit<TokenMetaData, 'uuid'> = {
	name: '',
	note: '',
	sliders: []
};


/**
 * Represents a token in the world, its properties are determined by its TokenData,
 * which can be set, updated, and retrieved through public methods.
 */

export default class Token extends Phaser.GameObjects.Sprite {
	readonly on_meta = new EventHandler<TokenMetaEvent>();
	readonly on_render = new EventHandler<TokenRenderEvent>();

	private shadow: Phaser.GameObjects.Sprite;

	private meta: TokenMetaData;
	
	private hovered: boolean = false;
	private selected: boolean = false;

	constructor(scene: Phaser.Scene, tokenData?: Partial<TokenMetaData>, pos?: Vec2, sprite?: string, index?: number) {
		super(scene, 0, 0, sprite ?? '', index);
		this.scene.add.existing(this);
		this.setDepth(500);

		this.meta = { ...DEFAULT_TOKEN_META, uuid: '' };
		this.setMeta({
			...DEFAULT_TOKEN_META,
			...tokenData ?? {},
			uuid: tokenData?.uuid ?? generateId(32)
		});

		this.shadow = this.scene.add.sprite(this.x, this.y, sprite ?? '', index);
		this.shadow.setOrigin(1 / 18, 1 / 18);
		this.shadow.setScale(18 / 16 / this.shadow.width, 18 / 16 / 4 / this.shadow.height);
		this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
		this.shadow.setTint(0x000000);
		this.shadow.setDepth(this.depth - 1);

		this.on('removefromscene', () => this.shadow.destroy());

		this.setOrigin(1 / 18, 1 / 18);
		this.setScale(18 / 16 / this.width, 18 / 16 / this.height);
		this.setPosition(pos?.x ?? 0, pos?.y ?? 0);
	}

	serialize(): TokenData {
		const data = {
			uuid: this.getUUID(),
			meta: this.getMeta(),
			render: this.getRender()
		};

		delete (data.meta as any).uuid;
		delete (data.render as any).uuid;
		return data;
	};

	getMeta(): TokenMetaData {
		return JSON.parse(JSON.stringify(this.meta));
	}

	setMeta(data: Partial<TokenMetaData>) {
		if (!this.meta) return;

		const preSer = JSON.stringify(this.meta);
		const postSer = JSON.stringify({ ...this.meta, ...data });
		
		if (preSer === postSer) return;

		const pre = JSON.parse(preSer);
		const post = JSON.parse(postSer);

		this.meta = post;
		this.on_meta.dispatch({ token: this, pre, post });
	}

	getRender(): TokenRenderData {
		return {
			uuid: this.getUUID(),
			pos: new Vec2(this.x, this.y),
			appearance: { sprite: this.texture.key, index: this.frame.name as any }
		};
	}

	setRender(render: Partial<TokenRenderData>) {
		if (render.pos) this.setPosition(render.pos.x, render.pos.y);
		if (render.appearance) this.setTexture(render.appearance.sprite, render.appearance.index);
	}

	getUUID(): string {
		return this.meta.uuid;
	}

	getFrameIndex(): number {
		return this.frame.name as any;
	}

	getFrameCount(): number {
		return Object.keys(this.texture.frames).length - 1;
	}

	setFrame(frame: number): this {
		const pos = new Vec2(this.x, this.y);
		const lastFrame = this.frame?.name as any || 0;
		Phaser.GameObjects.Sprite.prototype.setFrame.call(this, frame);

		if (this.on_render) this.on_render.dispatch({
			token: this,
			pos: { pre: pos, post: pos },
			appearance: {
				pre: { sprite: this.texture.key, index: lastFrame },
				post: { sprite: this.texture.key, index: frame }
			}
		});

		if (!this.shadow) return this;
		this.shadow.setFrame(frame);
		return this;
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
		if (this.x === x && this.y === y) return this;
		const pre = new Vec2(this.x, this.y);
		const post = new Vec2(x, y);

		Phaser.GameObjects.Sprite.prototype.setPosition.call(this, x, y);

		if (this.on_render) this.on_render.dispatch({
			token: this,
			pos: { pre, post },
			appearance: {
				pre: { sprite: this.texture.key, index: this.getFrameIndex() },
				post: { sprite: this.texture.key, index: this.getFrameIndex() }
			}
		});

		if (!this.shadow) return this;
		this.shadow.setPosition(x, y! + this.displayHeight - this.shadow.displayHeight - 0.125);
		return this;
	}

	setTexture(key: string, index?: string | number): this {
		Phaser.GameObjects.Sprite.prototype.setTexture.call(this, key, index);
		this.setScale(18 / 16 / this.width, 18 / 16 / this.height);
		if (!this.shadow) return this;

		this.shadow.setTexture(key, index);
		this.shadow.setScale(18 / 16 / this.shadow.width, 18 / 16 / 4 / this.shadow.height);
		this.shadow.y = this.y + this.displayHeight - this.shadow.displayHeight - 0.125;

		return this;
	}

	setVisible(visible: boolean): this {
		Phaser.GameObjects.Sprite.prototype.setVisible.call(this, visible);
		this.shadow.setVisible(visible);
		return this;
	}

	private updateShader() {
		if (this.selected) {
			this.setPipeline('outline');
			this.pipeline.set1f('tex_size', this.texture.source[0].width);
		}
		else if (this.hovered) {
			this.setPipeline('brighten');
		}
		else this.resetPipeline();
	}
}

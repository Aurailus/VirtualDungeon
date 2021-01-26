import EventHandler from '../../EventHandler';

import { Vec2 } from '../../util/Vec';

/** Represents a slider bar for a token. */
export interface TokenSliderData {
	name: string;
	color?: string;
	icon?: number;

	min?: number;
	max: number;
	current: number;
}

/** The meta information (name, sliders, note) for a token. */
export interface TokenMetaData {
	name: string;
	note: string;
	
	sliders: TokenSliderData[];
}

/** The render information for a token, such as position and sprite. */
export interface TokenRenderData {
	layer: number;
	pos: { x: number; y: number };
	appearance: { sprite: string; index: number };
}

/** Full token data, for serialization or info passing. */
export interface TokenData {
	uuid: string;
	meta: TokenMetaData;
	render: TokenRenderData;
}

/** Event object emitted when a token's meta data is modified. */
export interface TokenMetaEvent {
	token: Token;
	uuid: string;

	pre: TokenMetaData;
	post: TokenMetaData;
}

/** Event object emitted when a token's texture changes, or it is moved. */
export interface TokenRenderEvent {
	token: Token;
	uuid: string;

	pre: TokenRenderData;
	post: TokenRenderData;
}


/**
 * Represents a token in the world, its properties are determined by its TokenData,
 * which can be set, updated, and retrieved through public methods.
 */

export default class Token extends Phaser.GameObjects.Sprite {
	readonly on_meta = new EventHandler<TokenMetaEvent>();
	readonly on_render = new EventHandler<TokenRenderEvent>();

	readonly shadow?: Phaser.GameObjects.Sprite;
	
	private hovered: boolean = false;
	private selected: boolean = false;

	constructor(scene: Phaser.Scene, readonly uuid: string, layer: number, pos?: Vec2, sprite?: string, index?: number) {
		super(scene, 0, 0, sprite ?? '', index);
		this.scene.add.existing(this);
		this.setDepth(layer * 25 + 10);

		this.shadow = this.scene.add.sprite(this.x, this.y, sprite ?? '', index);
		this.shadow.setOrigin(1 / 18, 1 / 18);
		this.shadow.setScale(18 / 16 / this.shadow.width, 18 / 16 / 4 / this.shadow.height);
		this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
		this.shadow.setTint(0x000000);
		this.shadow.setDepth(this.depth - 1);

		this.scene.events.on('shutdown', () => console.log('yoo!'));

		this.setOrigin(1 / 18, 1 / 18);
		this.setScale(18 / 16 / this.width, 18 / 16 / this.height);
		this.setPosition(pos?.x ?? 0, pos?.y ?? 0);
	}


	/**
	 * Returns a serialized render data for the token.
	 */

	getRenderData(): TokenRenderData {
		return {
			pos: new Vec2(this.x, this.y),
			layer: Math.floor(this.depth / 25),
			appearance: { sprite: this.texture?.key, index: this.frame?.name as any }
		};
	}


	/**
	 * Updates the token with the render data provided.
	 */

	setRenderData(render: Partial<TokenRenderData>) {
		if (render.pos) this.setPosition(render.pos.x, render.pos.y);
		if (render.appearance) this.setTexture(render.appearance.sprite, render.appearance.index);
	}


	/**
	 * Returns the current frame index being used by this token.
	 */

	getFrameIndex(): number {
		return this.frame.name as any;
	}


	/**
	 * Returns the number of frames this token's sprite has.
	 */

	getFrameCount(): number {
		return Object.keys(this.texture.frames).length - 1;
	}


	/**
	 * Sets whether this token is selected or note.
	 */

	setSelected(selected: boolean) {
		this.selected = selected;
		this.updateShader();
	}


	/**
	 * Sets whether this token is hovered or not.
	 */

	setHovered(hovered: boolean) {
		this.hovered = hovered;
		this.updateShader();
	}


	/**
	 * Overrides of default phaser methods
	 * to emit render methods & update shadow below.
	 */

	setPosition(x?: number, y?: number): this {
		if (this.x === x && this.y === y) return this;
		const pre = this.getRenderData();
		Phaser.GameObjects.Sprite.prototype.setPosition.call(this, x, y);
		const post = this.getRenderData();
		this.on_render?.dispatch({ token: this, uuid: this.uuid, pre, post });
		this.shadow?.setPosition(x, y! + this.displayHeight - this.shadow.displayHeight - 0.125);
		return this;
	}

	setFrame(frame: number): this {
		const pre = this.getRenderData();
		Phaser.GameObjects.Sprite.prototype.setFrame.call(this, frame);
		const post = this.getRenderData();
		this.on_render?.dispatch({ token: this, uuid: this.uuid, pre, post });
		this.shadow?.setFrame(frame);
		return this;
	}

	setTexture(key: string, index?: string | number): this {
		const pre = this.getRenderData();
		Phaser.GameObjects.Sprite.prototype.setTexture.call(this, key, index);
		const post = this.getRenderData();
		this.on_render?.dispatch({ token: this, uuid: this.uuid, pre, post });
		this.setScale(18 / 16 / this.width, 18 / 16 / this.height);
		if (!this.shadow) return this;

		this.shadow.setTexture(key, index);
		this.shadow.setScale(18 / 16 / this.shadow.width, 18 / 16 / 4 / this.shadow.height);
		this.shadow.y = this.y + this.displayHeight - this.shadow.displayHeight - 0.125;

		return this;
	}

	setVisible(visible: boolean): this {
		Phaser.GameObjects.Sprite.prototype.setVisible.call(this, visible);
		this.shadow?.setVisible(visible);
		return this;
	}


	/**
	 * Updates the shader pipelines of the token.
	 */

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

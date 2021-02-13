import EventHandler from '../../EventHandler';

import { Vec2 } from '../../util/Vec';
import * as Color from '../../../../../common/Color';

/** Represents a slider bar for a token. */
export interface TokenSliderData {
	name: string;
	color: Color.HSV;
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
	implicitScale: number;
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

export default class Token extends Phaser.GameObjects.Container {
	readonly on_meta = new EventHandler<TokenMetaEvent>();
	readonly on_render = new EventHandler<TokenRenderEvent>();

	private sprite: Phaser.GameObjects.Sprite;
	private shadow: Phaser.GameObjects.Sprite;
	
	private hovered: boolean = false;
	private selected: boolean = false;

	private bars: Phaser.GameObjects.GameObject[] = [];
	// private meta: TokenMetaData = { name: '', note: '', sliders: [] };

	constructor(scene: Phaser.Scene, readonly uuid: string, layer: number, pos?: Vec2,
		public implicitScale: number = 1, sprite?: string, index?: number) {
		super(scene, 0, 0);
		this.scene.add.existing(this);

		this.setDepth(-1000 + layer * 25 + 1);
		this.setPosition(pos?.x ?? 0, pos?.y ?? 0);

		this.shadow = this.scene.add.sprite(0, 0, sprite ?? '', index);
		this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
		this.shadow.setTint(0x000000);
		this.add(this.shadow);

		this.sprite = this.scene.add.sprite(0, 0, sprite ?? '', index);
		this.add(this.sprite);

		this.updateScale();

		this.shadow.y = this.sprite.displayHeight - this.shadow.displayHeight - 0.125;
	}


	/**
	 * Returns a serialized render data for the token.
	 */

	getRenderData(): TokenRenderData {
		return {
			pos: new Vec2(this.x, this.y),
			implicitScale: this.implicitScale,
			layer: Math.floor((this.depth + 1000) / 25),
			appearance: { sprite: this.sprite.texture?.key, index: this.sprite.frame?.name as any }
		};
	}


	/**
	 * Updates the token with the render data provided.
	 */

	setRenderData(render: Partial<TokenRenderData>) {
		this.implicitScale = render.implicitScale ?? 1;
		if (render.pos) this.setPosition(render.pos.x, render.pos.y);
		if (render.implicitScale) this.updateScale();
		if (render.appearance) this.setTexture(render.appearance.sprite, render.appearance.index);
	}


	/**
	 * Sets the token's metadata.
	 */

	setMetaData(meta: TokenMetaData) {
		// this.meta = meta;
		this.updateSliders(meta.sliders);
	}


	/**
	 * Returns the current frame index being used by this token.
	 */

	getFrameIndex(): number {
		return this.sprite.frame.name as any;
	}


	/**
	 * Returns the number of frames this token's sprite has.
	 */

	getFrameCount(): number {
		return Object.keys(this.sprite.texture.frames).length - 1;
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
		if (!this.sprite) return Phaser.GameObjects.Sprite.prototype.setPosition.call(this, x, y) as any;
		
		const pre = this.getRenderData();
		Phaser.GameObjects.Sprite.prototype.setPosition.call(this, x, y);
		const post = this.getRenderData();
		if (this.sprite) this.on_render?.dispatch({ token: this, uuid: this.uuid, pre, post });
		return this;
	}

	setFrame(frame: number): this {
		const pre = this.getRenderData();
		this.sprite.setFrame(frame);
		this.shadow.setFrame(frame);
		const post = this.getRenderData();
		this.on_render?.dispatch({ token: this, uuid: this.uuid, pre, post });
		return this;
	}

	setTexture(key: string, index?: string | number): this {
		const pre = this.getRenderData();
		this.sprite.setTexture(key, index);
		const post = this.getRenderData();
		this.on_render?.dispatch({ token: this, uuid: this.uuid, pre, post });
		if (!this.shadow) return this;

		this.shadow.setTexture(key, index);
		this.updateScale();
		this.shadow.y = this.displayHeight - this.shadow.displayHeight - 0.125;

		return this;
	}


	/**
	 * Updates the scale of the token.
	 */

	private updateScale() {
		const frameWidth = this.sprite.width;
		const scaleFactor = frameWidth / (frameWidth - 2) / frameWidth * this.implicitScale;

		this.sprite.setScale(scaleFactor, scaleFactor);
		this.shadow.setScale(scaleFactor, scaleFactor / 4);

		this.shadow.setOrigin(1 / frameWidth, 1 / frameWidth);
		this.sprite.setOrigin(1 / frameWidth, 1 / frameWidth);

	}


	/**
	 * Updates the shader pipelines of the token.
	 */

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


	/**
	 * Updates slider indicators
	 */

	private updateSliders(sliders: TokenSliderData[]) {
		this.bars.forEach(bar => bar.destroy());
		if (sliders.length === 0) return;
		
		const SLIDER_WIDTH  = 32 / 16;
		const SLIDER_HEIGHT =  6 / 16;
		const STROKE_WIDTH  =  1 / 32;
		
		let Y_OFFSET = -(SLIDER_HEIGHT + STROKE_WIDTH) * sliders.length - 4 / 16;
		const X_OFFSET = (this.implicitScale / 2 - SLIDER_WIDTH / 2);

		const outline = this.scene.add.rectangle(X_OFFSET, Y_OFFSET,
			SLIDER_WIDTH, (SLIDER_HEIGHT + STROKE_WIDTH) * sliders.length - STROKE_WIDTH, 0xffffff);
		outline.setStrokeStyle(STROKE_WIDTH * 2, 0xffffff);
		outline.setOrigin(0);
		this.bars.push(outline);
		this.add(outline);

		sliders.forEach(s => {
			const bg = this.scene.add.rectangle(X_OFFSET, Y_OFFSET, SLIDER_WIDTH, SLIDER_HEIGHT, 0x19216c);
			bg.setOrigin(0);
			this.bars.push(bg);
			this.add(bg);

			const fg = this.scene.add.rectangle(X_OFFSET, Y_OFFSET,
				Math.min((s.current / s.max) * SLIDER_WIDTH, SLIDER_WIDTH), SLIDER_HEIGHT, Color.HSVToInt(s.color));
			fg.setOrigin(0);
			this.bars.push(fg);
			this.add(fg);

			const icon = this.scene.add.sprite(X_OFFSET + 1/24, Y_OFFSET, 'ui_slider_icons', s.icon);
			icon.setOrigin(0);
			icon.setScale((1 / 12) * SLIDER_HEIGHT);
			this.bars.push(icon);
			this.add(icon);

			Y_OFFSET += SLIDER_HEIGHT + STROKE_WIDTH;
		});
	}
}

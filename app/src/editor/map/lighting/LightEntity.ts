import * as Phaser from 'phaser';

import { Vec2 } from '../../util/Vec';

export default class LightEntity extends Phaser.GameObjects.Container {
	private tintSprite: Phaser.GameObjects.Sprite;

	private hovered: boolean = false;
	private selected: boolean = false;

	constructor(scene: Phaser.Scene, pos: Vec2, tint?: number) {
		super(scene, pos.x, pos.y);

		this.tintSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'light_tint');
		this.tintSprite.setScale(1 / 17);
		this.tintSprite.setTint(tint ?? 0xfff1b8);
		this.tintSprite.setOrigin(0);
		this.add(this.tintSprite);

		const base = new Phaser.GameObjects.Sprite(scene, 0, 0, 'light_base');
		base.setScale(1 / 17);
		base.setOrigin(0);
		this.add(base);

		this.setDepth(2000);
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
	 * Updates the shader pipelines of the token.
	 */

	private updateShader() {
		if (this.selected) {
			this.tintSprite.setPipeline('outline');
			this.tintSprite.pipeline.set1f('tex_size', 17);
		}
		else if (this.hovered) {
			this.tintSprite.setPipeline('brighten');
		}
		else this.tintSprite.resetPipeline();
	}
}

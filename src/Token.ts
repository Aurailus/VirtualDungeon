class Token extends Phaser.GameObjects.Container {
	sprite: Phaser.GameObjects.Sprite;
	shadow: Phaser.GameObjects.Sprite;

	width: number;
	height: number;

	constructor(scene: Phaser.Scene, x: number, y: number, tex: string) {
		super(scene, x, y);

		this.shadow = new Phaser.GameObjects.Sprite(scene, -4, -4, tex);
		this.shadow.setOrigin(0, 0);
		this.shadow.setScale(4, 1);
		this.shadow.setTint(0x000000);
		this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
		this.list.push(this.shadow);

		this.width = this.shadow.width * 4;
		this.height = this.shadow.height * 4;
		this.shadow.y = this.height - 24;

		this.sprite = new Phaser.GameObjects.Sprite(scene, -4, -4, tex);
		this.sprite.setOrigin(0, 0);
		this.sprite.setScale(4, 4);
		this.setPosition(x, y);
		this.list.push(this.sprite);

		this.scene.add.existing(this);
	}

	toggleOutline(outline: boolean) {
		if (outline) this.sprite.setPipeline("outline");
		else this.sprite.resetPipeline();
	}

	setPosition(x?: number, y?: number, z?: number, w?: number): this {
		Phaser.GameObjects.Container.prototype.setPosition.call(this, x * 4, y * 4, z, w);
		return this;
	}

	getPosition(): Vec2 {
		return new Vec2(this.x / 4, this.y / 4);
	}
}

interface SerializedToken {
	uuid: string,
	sprite: string,
	frame: number,
	x: number,
	y: number
}

class Token extends Phaser.GameObjects.Container {
	sprite: Phaser.GameObjects.Sprite | null = null;
	shadow: Phaser.GameObjects.Sprite | null = null;

	currentFrame: number = 0;

	uuid: string;

	width: number;
	height: number;

	constructor(scene: Phaser.Scene, x: number, y: number, tex: string) {
		super(scene, x, y);
		this.setTexture(tex);

		this.uuid = generateId(32);
	}

	private setTexture(tex: string) {
		if (this.shadow != null) this.shadow.setTexture(tex);
		else {
			this.shadow = new Phaser.GameObjects.Sprite(this.scene, -4, -4, tex);
			this.shadow.setOrigin(0, 0);
			this.shadow.setScale(4, 1);
			this.shadow.setTint(0x000000);
			this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
			this.list.push(this.shadow);
		}

		this.width = this.shadow.width * 4;
		this.height = this.shadow.height * 4;
		this.shadow.y = this.height - 24;

		if (this.sprite != null) this.sprite.setTexture(tex);
		else {
			this.sprite = new Phaser.GameObjects.Sprite(this.scene, -4, -4, tex);
			this.sprite.setOrigin(0, 0);
			this.sprite.setScale(4, 4);
			this.setPosition(this.x / 4, this.y / 4);
			this.list.push(this.sprite);
		}
	}

	setFrame(frame: number) {
		this.currentFrame = frame;
		this.sprite.setFrame(frame);
		this.shadow.setFrame(frame);
	}

	getFrame(): number {
		return this.currentFrame;
	}

	frameCount(): number {
		return Object.keys(this.sprite.texture.frames).length - 1;
	}

	toggleOutline(outline: boolean) {
		if (outline) {
			this.sprite.setPipeline("outline");
			this.sprite.pipeline.setFloat1("tex_size", this.sprite.texture.source[0].width);
		}
		else this.sprite.resetPipeline();
	}

	setPosition(x?: number, y?: number, z?: number, w?: number): this {
		Phaser.GameObjects.Container.prototype.setPosition.call(this, x * 4, y * 4, z, w);
		return this;
	}

	getPosition(): Vec2 {
		return new Vec2(this.x / 4, this.y / 4);
	}

	// For converting token to / from serialized data

	serialize(): string {
		return JSON.stringify(({
			uuid: this.uuid,
			sprite: this.sprite.texture.key,
			frame: this.currentFrame,
			x: this.x / 4,
			y: this.y / 4
		} as SerializedToken));
	}

	static deserialize(scene: Phaser.Scene, serialized: string): Token {
		let tkn = new Token(scene, 0, 0, "");
		tkn.loadSerializedData(serialized);
		return tkn;
	}

	loadSerializedData(serialized: string) {
		let tbl: SerializedToken = JSON.parse(serialized);
		this.uuid = tbl.uuid;
		this.setTexture(tbl.sprite);
		this.setFrame(tbl.frame)
		this.setPosition(tbl.x, tbl.y);
	}
}

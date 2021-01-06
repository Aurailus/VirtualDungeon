import { generateId } from './util/Helpers';

export interface SerializedToken {
	uuid: string;
	sprite: string;
	frame: number;
	x: number;
	y: number;
}

export default class Token extends Phaser.GameObjects.Container {
	sprite: Phaser.GameObjects.Sprite;
	shadow: Phaser.GameObjects.Sprite;

	currentFrame: number = 0;

	uuid: string;

	width: number = 0;
	height: number = 0;

	hovered: boolean = false;
	selected: boolean = false;

	constructor(scene: Phaser.Scene, x: number, y: number, tex: string) {
		super(scene, x, y);

		this.shadow = new Phaser.GameObjects.Sprite(this.scene, 0, 0, '');
		this.shadow.setOrigin(0, 0);
		this.shadow.setScale(1 / this.shadow.width, 0.25 / this.shadow.height);
		this.shadow.setTint(0x000000);
		this.shadow.setAlpha(0.1, 0.1, 0.3, 0.3);
		this.list.push(this.shadow);

		this.sprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, '');
		this.sprite.setOrigin(0, 0);
		this.sprite.setScale(1 / this.sprite.width, 1 / this.sprite.height);
		this.setPosition(this.x, this.y);
		this.list.push(this.sprite);

		this.setTexture(tex);

		this.uuid = generateId(32);
	}

	static deserialize(scene: Phaser.Scene, serialized: string): Token {
		let tkn = new Token(scene, 0, 0, '');
		tkn.loadSerializedData(serialized);
		return tkn;
	}

	setTexture(tex: string) {
		this.shadow.setTexture(tex);
		this.sprite.setTexture(tex);

		this.shadow.setScale(1 / this.shadow.width, 0.25 / this.shadow.height);
		this.sprite.setScale(1 / this.sprite.width, 1 / this.sprite.height);

		this.shadow.y = this.sprite.displayHeight - this.shadow.displayHeight - 0.025;

		this.width = this.sprite.displayWidth;
		this.height = this.sprite.displayHeight;
	}

	setFrame(frame: number): void {
		this.currentFrame = frame;
		if (!this.sprite || !this.shadow) { console.log('Tried to get the frame count of a Token without a sprite!'); return; }
		this.sprite.setFrame(frame);
		this.shadow.setFrame(frame);
	}

	getFrame(): number {
		return this.currentFrame;
	}

	frameCount(): number {
		if (!this.sprite || !this.shadow) { console.log('Tried to get the frame count of a Token without a sprite!'); return 0; }
		return Object.keys(this.sprite.texture.frames).length - 1;
	}

	setHovered(hovered: boolean) {
		if (!this.sprite) return;
		if (this.hovered === hovered) return;
		this.hovered = hovered;

		if (!hovered && !this.selected) {
			// this.sprite.resetPipeline();
			this.sprite.setTint(0xffffff);
			return;
		}

		if (!this.selected) this.sprite.setTint(0x999999);

		// if (!this.selected) this.sprite.setPipeline('brighten');
	}

	setSelected(selected: boolean) {
		if (!this.sprite) return;
		if (this.selected === selected) return;
		this.selected = selected;

		if (!selected) {
			// if (!this.hovered) this.sprite.resetPipeline();
			// else this.sprite.setPipeline('brighten');
			if (!this.hovered) this.sprite.setTint(0xffffff);
			else this.sprite.setTint(0x999999);
		}
		else {
			// this.sprite.setPipeline('outline');
			this.sprite.setTint(0x000000);
			// @ts-ignore
			// this.sprite.pipeline.setFloat1('tex_size', this.sprite.texture.source[0].width);
		}
	}

	// Serialization Methods
	serialize(): string {
		return JSON.stringify(({
			uuid: this.uuid,
			sprite: this.sprite ? this.sprite.texture.key : '',
			frame: this.currentFrame,
			x: this.x,
			y: this.y
		} as SerializedToken));
	}

	loadSerializedData(serialized: string) {
		let tbl: SerializedToken = JSON.parse(serialized);
		this.uuid = tbl.uuid;
		this.setTexture(tbl.sprite);
		this.setFrame(tbl.frame);
		this.setPosition(tbl.x, tbl.y);
	}
}

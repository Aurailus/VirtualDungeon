class UIComponent extends Phaser.GameObjects.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, tex: string) {
		super(scene, x, y, tex);
		this.setOrigin(0, 0);
		this.setScale(3, 3);
		this.setPos(x * 3, y * 3);

		this.scene.add.existing(this);
	}

	setPos(x: number, y: number) {
		this.setPosition(x * 3, y * 3);
	}

	mouseIntersects(): boolean {
		let pointer = this.scene.input.mousePointer;
		return (pointer.x >= this.x && pointer.y >= this.y && pointer.x <= this.x + this.width * 3 && pointer.y <= this.y + this.height * 3); 
	}

	mousePos(): Vec2 {
		let pointer = this.scene.input.mousePointer;
		return new Vec2(Math.round((pointer.x - this.x)/3), Math.round((pointer.y - this.y)/3));
	}
}

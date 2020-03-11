class UIContainer extends Phaser.GameObjects.Container {
	intersects: Phaser.GameObjects.Sprite[] = [];

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
		this.setPos(x * 3, y * 3);
		this.setActive(true);

		this.scene.add.existing(this);
	}

	setPos(x: number, y: number) {
		this.setPosition(x * 3, y * 3);
	}

	mouseIntersects(): boolean {
		for (let i of this.list) {
			if ((i as UIComponent).mouseIntersects != null) if ((i as UIComponent).mouseIntersects()) return true;
		}
		for (let i of this.intersects) {
			let pointer = this.scene.input.mousePointer;
			if (pointer.x >= this.x + i.x && pointer.y >= this.y + i.y 
				&& pointer.x <= this.x + i.x + i.width * i.scaleX && pointer.y <= this.y + i.y + i.height * i.scaleY) 
				return true;
		}
		return false;
	}

	mousePos(): Vec2 {
		let pointer = this.scene.input.mousePointer;
		return new Vec2(Math.round((pointer.x - this.x)/3), Math.round((pointer.y - this.y)/3));
	}
}

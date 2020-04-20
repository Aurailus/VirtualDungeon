class UITokenProps extends UIContainer {

	constructor(scene, x, y) {
		super(scene, x, y);

		let dims = new Vec2(300, 400);

		let e = new Phaser.GameObjects.Sprite(scene, 0, 0, "ui_background_9x", 0);
		e.setScale(3, 3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 8*3, 0, "ui_background_9x", 1);
		e.setScale((dims.x - 16*3) / 8, 3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, dims.x - 8*3, 0, "ui_background_9x", 2);
		e.setScale(3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 0, 8*3, "ui_background_9x", 3);
		e.setScale(3, (dims.y - 16 * 3) / 8);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 8*3, 8*3, "ui_background_9x", 4);
		e.setScale((dims.x - 16*3) / 8, (dims.y - 16 * 3) / 8);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, dims.x - 8*3, 8*3, "ui_background_9x", 5);
		e.setScale(3, (dims.y - 16 * 3) / 8);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 0, (dims.y - 8*3), "ui_background_9x", 6);
		e.setScale(3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, 8*3, (dims.y - 8*3), "ui_background_9x", 7);
		e.setScale((dims.x - 16*3) / 8, 3);
		this.add(e);

		e = new Phaser.GameObjects.Sprite(scene, dims.x - 8*3, (dims.y - 8*3), "ui_background_9x", 8);
		e.setScale(3);
		this.add(e);

		this.list.forEach(e => (e as Phaser.GameObjects.Sprite).setOrigin(0, 0));

	}
}

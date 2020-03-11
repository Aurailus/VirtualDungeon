class UISidebar extends UIContainer {
	scene: MainScene;

	backgrounds: Phaser.GameObjects.Sprite[] = [];
	
	activeSpriteCursor: Phaser.GameObjects.Sprite;
	hoverSpriteCursor: Phaser.GameObjects.Sprite;

	elems: any[] = [];
	sprites: any[] = [];

	hoveredElem: Vec2 | null = null;

	constructor(scene: MainScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;

		for (let i = 0; i < 15; i++) {
			let background = new Phaser.GameObjects.Sprite(this.scene, 0, 21 * 3 * i, "ui_sidebar_bg", 1);
			background.setScale(3);
			background.setOrigin(0, 0);

			this.backgrounds.push(background);
			this.list.push(background);
		}

		this.activeSpriteCursor = new Phaser.GameObjects.Sprite(this.scene, 9, 9, "ui_sidebar_cursor");
		this.activeSpriteCursor.setScale(3);
		this.activeSpriteCursor.setOrigin(0);
		this.list.push(this.activeSpriteCursor);

		this.hoverSpriteCursor = new Phaser.GameObjects.Sprite(this.scene, 3, 3, "ui_sidebar_cursor");
		this.hoverSpriteCursor.setScale(3);
		this.hoverSpriteCursor.setOrigin(0);
		this.hoverSpriteCursor.setAlpha(0.35);
		this.hoverSpriteCursor.setVisible(false);
		this.list.push(this.hoverSpriteCursor);
	}

	mouseIntersects(): boolean {
		return (this.mousePos().x < 69); 
	}

	update() {
		let hovered = undefined;

		if (this.mouseIntersects()) {
			if (this.mousePos().x % 21 >= 4 && this.mousePos().y % 21 >= 4) {
				let mousePos = this.mousePos();

				let x = Math.floor(mousePos.x / 21);
				let y = Math.floor(mousePos.y / 21);

				hovered = this.sprites[x + y * 3];

				if (hovered != undefined) {
					this.hoverSpriteCursor.setVisible(true);
					this.hoverSpriteCursor.setPosition(9 + x * 21 * 3, 9 + y * 21 * 3);
				}
				else {
					this.hoverSpriteCursor.setVisible(false);
					return;
				}

				if (hovered == undefined && this.hoveredElem != null) {
					this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
					this.hoveredElem = null;
					return;
				}

				if (this.hoveredElem != null && this.hoveredElem.x != x && this.hoveredElem.y != y) 
					this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);

				this.elemHover(x, y);
				this.hoveredElem = new Vec2(x, y);

				if (this.scene.input.mousePointer.leftButtonDown()) {
					this.activeSpriteCursor.setPosition(9 + x * 21 * 3, 9 + y * 21 * 3);
					this.elemClick(x, y);
				}
			}
			else {
				if (this.hoveredElem != null)
					this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
				this.hoveredElem = null;
				this.hoverSpriteCursor.setVisible(false);
			}
		}
		else this.hoverSpriteCursor.setVisible(false);
	}

	elemHover(x: number, y: number): void {}
	elemUnhover(x: number, y: number): void {}

	elemClick(x: number, y: number): void {}
}

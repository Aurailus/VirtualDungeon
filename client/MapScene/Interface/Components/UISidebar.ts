class UISidebar extends UIContainer {
	scene: MapScene;

	backgrounds: Phaser.GameObjects.Sprite[] = [];
	
	activeSpriteCursor: Phaser.GameObjects.Sprite;
	hoverSpriteCursor: Phaser.GameObjects.Sprite;

	scrollY: number = 0;

	elems: any[] = [];
	sprites: any[] = [];

	hoveredElem: Vec2 | null = null;

	constructor(scene: MapScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;

		for (let i = 0; i < 30; i++) {
			let background = new Phaser.GameObjects.Sprite(this.scene, 0, 21 * 3 * i, "ui_sidebar_bg", 1);
			background.setScale(3);
			background.setOrigin(0, 0);

			this.backgrounds.push(background);
			this.list.push(background);
		}

		this.activeSpriteCursor = new Phaser.GameObjects.Sprite(this.scene, 9, 9 + 21 * 3, "ui_sidebar_cursor");
		this.activeSpriteCursor.setScale(3);
		this.activeSpriteCursor.setOrigin(0);
		this.activeSpriteCursor.setVisible(false);
		this.list.push(this.activeSpriteCursor);

		this.hoverSpriteCursor = new Phaser.GameObjects.Sprite(this.scene, 3, 3, "ui_sidebar_cursor");
		this.hoverSpriteCursor.setScale(3);
		this.hoverSpriteCursor.setOrigin(0);
		this.hoverSpriteCursor.setAlpha(0.35);
		this.hoverSpriteCursor.setVisible(false);
		this.list.push(this.hoverSpriteCursor);

		// Bind the scroll wheel event
		this.onWheel = this.onWheel.bind(this);
		document.documentElement.addEventListener("wheel", this.onWheel);
		this.scene.events.on('destroy', () => document.documentElement.removeEventListener("wheel", this.onWheel));
	}

	private onWheel(e: WheelEvent) {
		if (this.scene.ui.uiActive) {
			let dir = (e.deltaY < 0 ? 1 : -1);
			this.scrollY = clamp(this.scrollY + dir * 63, 0, -1000);

			this.scene.tweens.add({
				targets: this,
				y: this.scrollY,
				ease: 'Cubic',
				duration: 160,
				repeat: 0
			});
		}
	}		

	mouseIntersects(): boolean {
		return (this.mousePos().x < 69); 
	}

	update() {
		let hovered = null;

		if (this.mouseIntersects()) {
			if (this.mousePos().x % 21 >= 4 && this.mousePos().y % 21 >= 4) {
				let mousePos = this.mousePos();

				let x = Math.floor(mousePos.x / 21);
				let y = Math.floor(mousePos.y / 21) - 1;

				for (let i = 0; i < this.sprites.length; i++) {
					if (Math.floor(this.sprites[i].x / 21 / 3) == x && Math.floor(this.sprites[i].y / 21 / 3) - 1 == y) {
						hovered = this.sprites[i];
						break;
					}
				}

				if (hovered != null) {
					this.hoverSpriteCursor.setVisible(true);
					this.hoverSpriteCursor.setPosition(9 + x * 21 * 3, 9 + (y + 1) * 21 * 3);
				}
				else {
					this.hoverSpriteCursor.setVisible(false);
					return;
				}

				if (hovered == null && this.hoveredElem != null) {
					this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
					this.hoveredElem = null;
					return;
				}

				if (this.hoveredElem != null && this.hoveredElem.x != x && this.hoveredElem.y != y) 
					this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);

				this.elemHover(x, y);
				this.hoveredElem = new Vec2(x, y);

				if (this.scene.i.mouseLeftPressed()) {
					this.activeSpriteCursor.setPosition(9 + x * 21 * 3, 9 + (y + 1) * 21 * 3);
					this.activeSpriteCursor.setVisible(true);
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

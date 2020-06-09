// class UITokenSelector extends UIContainer {
// 	scene: MapScene;

// 	background: Phaser.GameObjects.Sprite;
// 	tokenSprites: Phaser.GameObjects.Sprite[];

// 	tokens: string[] = [];
// 	selectSprite: Phaser.GameObjects.Sprite;

// 	constructor(scene: MapScene, x: number, y: number) {
// 		super(scene, x, y);
// 		this.scene = scene;

// 		this.background = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "ui_quick_selector");
// 		this.background.setScale(3, 3);
// 		this.background.setOrigin(0, 0);
// 		this.intersects.push(this.background);
// 		this.add(this.background);

// 		this.selectSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "cursor");
// 		this.selectSprite.setScale(3, 3);
// 		this.selectSprite.setOrigin(0, 0);
// 		this.add(this.selectSprite);
// 		this.positionSelect(0);
// 	}

// 	positionSelect(slot: number) {
// 		this.selectSprite.setPosition(12, 18 + slot*60);	
// 	}

// 	update() {
// 		if (this.mouseIntersects() && this.scene.i.mouseLeftPressed()) {
// 			let mousePos = this.mousePos();
// 			if (mousePos.x < 4 || mousePos.x > 4 + 16) return;

// 			mousePos.y -= 6;
// 			if (mousePos.y % 20 > 16) return;

// 			let slot = Math.floor(mousePos.y / 20);
// 			if (slot < 0 || slot >= this.tokens.length) return;
// 			this.scene.token.selectedTokenType = this.tokens[slot];
// 			this.positionSelect(slot);
// 		}
// 	}

// 	addToken(sprite: string) {
// 		let pos = this.tokens.length;
// 		this.tokens.push(sprite);

// 		let spr = new Phaser.GameObjects.Sprite(this.scene, 12 - 3, 18 - 3 + pos*60, sprite);
// 		spr.setOrigin(0, 0);
// 		spr.setScale(3);
// 		this.add(spr);
// 		this.sendToBack(spr);
// 		this.sendToBack(this.background);
// 	}
// }

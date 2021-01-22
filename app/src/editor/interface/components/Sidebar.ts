import * as Phaser from 'phaser';

import Component from './Component';
import InputManager from '../../InputManager';

import { clamp } from '../../util/Helpers';
import { Vec2, Vec4 } from '../../util/Vec';

export default abstract class Sidebar extends Component {
	backgrounds: Phaser.GameObjects.Sprite[] = [];
	
	activeSpriteCursor: Phaser.GameObjects.Sprite;
	hoverSpriteCursor: Phaser.GameObjects.Sprite;

	scrollY: number = 0;

	elems: any[] = [];
	sprites: any[] = [];

	hoveredElem: Vec2 | null = null;

	constructor(scene: Phaser.Scene, x: number, y: number, protected inputManager: InputManager) {
		super(scene, x, y);
		this.scene = scene;

		this.collision = new Vec4(0, 0, 68, Infinity);

		for (let i = 0; i < 30; i++) {
			let background = this.scene.add.sprite(0, 21 * i, 'ui_sidebar_bg', 1);
			background.setOrigin(0);

			this.backgrounds.push(background);
			this.add(background);
		}

		this.activeSpriteCursor = this.scene.add.sprite(3, 24, 'ui_sidebar_cursor');
		this.activeSpriteCursor.setOrigin(0);
		this.activeSpriteCursor.setVisible(false);
		this.add(this.activeSpriteCursor);

		this.hoverSpriteCursor = this.scene.add.sprite(1, 1, 'ui_sidebar_cursor');
		this.hoverSpriteCursor.setOrigin(0);
		this.hoverSpriteCursor.setAlpha(0.35);
		this.hoverSpriteCursor.setVisible(false);
		this.add(this.hoverSpriteCursor);

		// Bind the scroll wheel event
		this.inputManager.bindScrollEvent(this.onWheel);
	}

	update() {
		let hovered = null;
		const collides = this.mouseCollides();
		const cursorPos = this.getCursorPos();

		if (collides) {
			if (cursorPos.x % 21 >= 4 && cursorPos.y % 21 >= 4) {
				const tilePos = new Vec2(cursorPos.x / 21, cursorPos.y / 21).floor();

				for (let i = 0; i < this.sprites.length; i++) {
					if (Math.floor(this.sprites[i].x / 21) === tilePos.x &&
						Math.floor(this.sprites[i].y / 21) === tilePos.y) {
						
						hovered = this.sprites[i];
						break;
					}
				}

				if (hovered !== null) {
					this.hoverSpriteCursor.setVisible(true);
					this.hoverSpriteCursor.setPosition(3 + tilePos.x * 21, 3 + tilePos.y * 21);
				}
				else {
					this.hoverSpriteCursor.setVisible(false);
					return;
				}

				if (hovered === null && this.hoveredElem !== null) {
					this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
					this.hoveredElem = null;
					return;
				}

				if (this.hoveredElem !== null && this.hoveredElem.x !== tilePos.x && this.hoveredElem.y !== tilePos.y)
					this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);

				this.elemHover(tilePos.x, tilePos.y);
				this.hoveredElem = tilePos;

				if (this.inputManager.mouseLeftPressed()) {
					this.activeSpriteCursor.setPosition(3 + tilePos.x * 21, 3 + tilePos.y * 21);
					this.activeSpriteCursor.setVisible(true);
					this.elemClick(tilePos.x, tilePos.y);
				}
			}
			else {
				if (this.hoveredElem !== null)
					this.elemUnhover(this.hoveredElem.x, this.hoveredElem.y);
				this.hoveredElem = null;
				this.hoverSpriteCursor.setVisible(false);
			}
		}
		else this.hoverSpriteCursor.setVisible(false);
	}

	private onWheel = (delta: number) => {
		if (this.mouseCollides()) {
			this.scrollY = clamp(this.scrollY + delta * 21, 0, -1000);

			this.scene.tweens.add({
				targets: this,
				y: this.scrollY,
				ease: 'Cubic',
				duration: 120,
				repeat: 0
			});

			return true;
		}
		return false;
	};

	abstract elemHover(x: number, y: number): void;
	abstract elemUnhover(x: number, y: number): void;
	abstract elemClick(x: number, y: number): void;
}

import * as Phaser from 'phaser';

import InputManager from '../interact/InputManager';

import { Vec2 } from '../util/Vec';

/** Various handlers for events. */
interface Handlers<T> {

	/** Indicates if handleCreate can be called. */
	canCreate: () => boolean;

	/** Creates an entity at the specified position, and returns it. */
	handleCreate: (pos: Vec2) => T;

	/** Delets a set of entities, removing them from the entity array. */
	handleDelete: (entities: Set<T>) => void;

	/** Optional callback to serialize data before a move. */
	onPreMove?: (entities: Set<T>) => any[] | null;

	/** Optional callback to serialize data after a move. */
	onPostMove?: (entities: Set<T>, preData: any[] | null) => void;
}


/**
 * An interface for a generic entity that can be managed by the EntityController.
 */

interface EditableEntity {
	x: number;
	y: number;

	setIndex: (index: number) => void | undefined;
	setPosition(x: number, y?: number, z?: number, w?: number): this;

	getDimensions(): Vec2;
	setHovered(hovered: boolean): void;
	setSelected(selected: boolean): void;

}


/**
 * Manipulates entities in response to user input.
 */

export default class EntityController<T extends EditableEntity> {

	/** A preview of an entity that can be created. */
	preview?: Phaser.GameObjects.Container;

	/** The current mode that the controller is in. */
	mode: 'place' | 'select' | 'move' = 'place';

	/** The currently hovered entity. */
	hovered: T | null = null;

	/** The currently selected entities. */
	selected: Set<T> = new Set();

	private startTilePos: Vec2 = new Vec2();
	private preMoveData: any[] | null | undefined = undefined;
	private clickTestState: null | false | true = null;

	/** Rendering primitives. */
	private cursor: Phaser.GameObjects.Sprite;
	private primitives: (Phaser.GameObjects.Line | Phaser.GameObjects.Sprite)[] = [];

	constructor(private scene: Phaser.Scene, private entities: T[], private handlers: Handlers<T>) {
		this.cursor = this.scene.add.sprite(0, 0, 'cursor');
		this.cursor.setDepth(1000);
		this.cursor.setOrigin(0, 0);
		this.cursor.setScale(1 / 16);
		this.cursor.setVisible(false);
	}


	/**
	 * Updates the controller, allowing the user
	 * to interact with the entities it controls.
	 *
	 * @param {Vec2} cursorPos - The cursor position.
	 * @param {InputManager} input - The input manager.
	 */

	update(cursorPos: Vec2, input: InputManager) {
		switch (this.mode) {
		default: break;
		case 'place':
			this.handlePlace(cursorPos, input);
			break;

		case 'select':
			this.handleSelect(cursorPos, input);
			break;

		case 'move':
			this.handleMove(cursorPos, input);
		}

		this.preview?.setPosition(cursorPos.x, cursorPos.y);
		this.cursor.setPosition(cursorPos.x, cursorPos.y);

		this.preview?.setVisible(!this.hovered && this.handlers.canCreate());
		this.cursor.setVisible(!this.hovered && (this.mode === 'select' || !this.handlers.canCreate()));
	}


	/**
	 * Cleans up any pending interactions,
	 * and stops rendering any primitives.
	 */

	deactivate() {
		this.selected.forEach(t => t.setSelected(false));
		this.selected = new Set();
		
		if (this.hovered) this.hovered.setHovered(false);
		this.hovered = null;

		this.primitives.forEach(e => e.destroy());
		this.primitives = [];
		this.preview?.setVisible(false);
		this.cursor.setVisible(false);
	}


	/**
	 * Handles 'place mode', selecting / creating entities,
	 * initiating move mode when necessary.
	 *
	 * @param {Vec2} cursorPos - The cursor position.
	 * @param {InputManager} input - The input manager.
	 */

	private handlePlace(cursorPos: Vec2, input: InputManager) {
		if (this.selected.size) this.keyboardMove(input);

		// Find the currently hovered entity.
		if (!this.hovered || cursorPos.x < this.hovered.x || cursorPos.y < this.hovered.y
			|| cursorPos.x >= this.hovered.x + this.hovered.getDimensions().x
			|| cursorPos.y >= this.hovered.y + this.hovered.getDimensions().x) {
			this.hovered?.setHovered(false);
			this.hovered = null;

			for (let i = this.entities.length - 1; i >= 0; i--) {
				let entity = this.entities[i];
				if (cursorPos.x >= entity.x && cursorPos.y >= entity.y
					&& cursorPos.x < entity.x + entity.getDimensions().x && cursorPos.y < entity.y + entity.getDimensions().y) {
					
					this.hovered = entity;
					this.hovered.setHovered(true);
					break;
				}
			}
		}

		// Place / select entity, start moving if any are selected.
		if (input.mouseLeftPressed()) {
			if (!this.hovered) {
				if (this.handlers.canCreate()) {
					let entity = this.handlers.handleCreate(cursorPos);
					entity.setSelected(true);
					this.hovered = entity;
				}
				else {
					this.startTilePos = cursorPos;
					this.mode = 'select';
					return;
				}
			}

			if (input.keyDown('CTRL')) {
				if (this.hovered && !this.selected.has(this.hovered)) {
					this.hovered.setSelected(true);
					this.selected.add(this.hovered);
				}
				else this.clickTestState = false;
			}
			else {
				this.selected.forEach(t => t.setSelected(false));
				if (this.hovered) {
					this.selected = new Set([ this.hovered ]);
					this.hovered.setSelected(true);
				}
			}

			if (this.selected.size) {
				this.startTilePos = cursorPos;
				this.mode = 'move';
			}
		}

		if (input.keyDown('DELETE') && this.selected.size > 0) {
			this.handlers.handleDelete(this.selected);
			while (this.selected.size !== 0) {
				let entity = this.selected.values().next()!.value;
				if (this.hovered === entity) this.hovered = null;
				this.selected.delete(entity);
			}
		}
	}


	/**
	 * Handles 'select mode', which controls
	 * creating rectangle selections.
	 *
	 * @param {Vec2} cursorPos - The cursor's position.
	 * @param {InputManager} input - The input manager.
	 */

	private handleSelect(cursorPos: Vec2, input: InputManager) {
		const a = new Vec2(Math.min(this.startTilePos.x, cursorPos.x), Math.min(this.startTilePos.y, cursorPos.y));
		const b = new Vec2(Math.max(this.startTilePos.x, cursorPos.x), Math.max(this.startTilePos.y, cursorPos.y));

		this.primitives.forEach(v => v.destroy());
		this.primitives = [];

		if (!input.mouseLeftDown()) {
			if (!input.keyDown('CTRL')) {
				for (const t of this.selected) t.setSelected(false);
				this.selected = new Set();
			}

			for (const entity of this.entities) {
				if (entity.x >= a.x && entity.y >= a.y && entity.x <= b.x && entity.y <= b.y) {

					if (input.keyDown('CTRL')) {
						const selected = this.selected.has(entity);
						entity.setSelected(!selected);
						if (selected) this.selected.delete(entity);
						else this.selected.add(entity);
					}
					else {
						this.selected.add(entity);
						entity.setSelected(true);
					}
				}
			}

			this.mode = 'place';
			return;
		}

		const fac = 0.03;
		this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac, b.x + 1 - fac, a.y + fac, 0xffffff, 1));
		this.primitives.push(this.scene.add.line(0, 0, a.x + fac, a.y + fac / 2, a.x + fac, b.y + 1 - fac / 2, 0xffffff, 1));
		this.primitives.push(this.scene.add.line(0, 0, a.x + fac, b.y + 1 - fac, b.x + 1 - fac, b.y + 1 - fac, 0xffffff, 1));
		this.primitives.push(this.scene.add.line(0, 0, b.x + 1 - fac, a.y + fac / 2, b.x + 1 - fac, b.y + 1 - fac / 2, 0xffffff, 1));

		this.primitives.forEach(v => {
			(v as Phaser.GameObjects.Line).setLineWidth(0.03);
			v.setOrigin(0, 0);
			v.setDepth(300);
		});
	}


	/**
	 * Handles 'move mode', which allows entities
	 * to be dragged around the canvas.
	 *
	 * @param {Vec2} cursorPos - The cursor's position.
	 * @param {InputManager} input - The input manager.
	 */

	private handleMove(cursorPos: Vec2, input: InputManager) {
		this.cursor.setVisible(false);

		if (this.preMoveData === undefined) this.preMoveData = this.handlers.onPreMove?.(this.selected);

		if (!this.selected.size) {
			this.mode = 'place';
			return;
		}

		if (!input.mouseLeftDown()) {
			this.mode = 'place';

			if (this.clickTestState) {
				this.handlers.onPostMove?.(this.selected, this.preMoveData ?? null);
				this.preMoveData = undefined;
			}
			else if (this.clickTestState === false && this.hovered && input.keyDown('CTRL')) {
				this.selected.delete(this.hovered);
				this.hovered.setSelected(false);
			}

			this.clickTestState = null;

			return;
		}
		
		let offset = new Vec2(cursorPos.x - this.startTilePos.x, cursorPos.y - this.startTilePos.y);
		if (!offset.x && !offset.y) return;

		this.clickTestState = true;
		this.startTilePos = cursorPos;

		this.selected.forEach(t => t.setPosition(t.x + offset.x, t.y + offset.y));
	}


	/**
	 * Handles arrow-key bindings for moving entities.
	 *
	 * @param {InputManager} input - The input manager.
	 */

	private keyboardMove(input: InputManager): void {
		if (input.keyPressed('UP')) this.moveBy(0, -1, 2);
		if (input.keyPressed('LEFT')) this.moveBy(-1, 0, 1);
		if (input.keyPressed('DOWN')) this.moveBy(0, 1, 0);
		if (input.keyPressed('RIGHT')) this.moveBy(1, 0, 3);
	}


	/**
	 * Moves the selected entites by the specified values,
	 * updating its display index as well.
	 *
	 * @param {number} x - The x offset to move by.
	 * @param {number} y - The y offset to move by.
	 * @param {number} index - The display index to set the entities to.
	 */

	private moveBy(x: number, y: number, index: number): void {
		const preMoveData: any = this.handlers.onPreMove?.(this.selected);

		this.selected.forEach(entity => {
			entity.setPosition(entity.x + x, entity.y + y);
			entity.setIndex?.(index);
		});

		this.handlers.onPostMove?.(this.selected, preMoveData);
	}
}

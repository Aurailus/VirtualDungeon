import * as Phaser from 'phaser';

import Sidebar from './Sidebar';

import Map from '../../map/Map';
import ModeManager from '../../mode/ModeManager';
import ArchitectMode from '../../mode/ArchitectMode';
import type InputManager from '../../interact/InputManager';

import { Asset } from '../../util/Asset';

export default class TileSidebar extends Sidebar {
	
	walls: string[] = [];
	floors: string[] = [];
	details: string[] = [];

	constructor(scene: Phaser.Scene, x: number, y: number, assets: Asset[],
		inputManager: InputManager, private mode: ModeManager, private map: Map) {
		super(scene, x, y, inputManager);

		let add_wall = new Phaser.GameObjects.Sprite(this.scene, 3 + x * 21, 3 + y * 21, 'ui_sidebar_browse');
		add_wall.setName('add_wall');
		add_wall.setOrigin(0);
		this.add(add_wall);
		this.sprites.push(add_wall);

		for (let tileset of assets.filter((a) => a.type === 'wall'))
			this.addWall(tileset.identifier);
		
		let add_floor = new Phaser.GameObjects.Sprite(this.scene, 3 + x * 21, 3 + y * 21, 'ui_sidebar_browse');
		add_floor.setName('add_floor');
		add_floor.setOrigin(0);
		this.add(add_floor);
		this.sprites.push(add_floor);

		for (let tileset of assets.filter((a) => a.type === 'floor'))
			this.addFloor(tileset.identifier);

		let add_detail = new Phaser.GameObjects.Sprite(this.scene, 3 + x * 21, 3 + y * 21, 'ui_sidebar_browse');
		add_detail.setName('add_detail');
		add_detail.setOrigin(0);
		this.add(add_detail);
		this.sprites.push(add_detail);

		for (let tileset of assets.filter((a) => a.type === 'detail'))
			this.addDetail(tileset.identifier);

		for (let i = 0; i < 12; i++) {
			if (i % 4 !== 0) this.backgrounds[i].setFrame(0);
		}
	}

	elemClick(x: number, y: number): void {
		const controller = (this.mode.active as ArchitectMode).controller;
		if (!controller) return;
		if (y < 4) {
			controller.setActiveTile(this.map.tileStore.indices[this.walls[x + (y - 1) * 3]]);
			controller.setActiveTileType('wall');
		}
		else if (y < 8) {
			controller.setActiveTile(this.map.tileStore.indices[this.floors[x + (y - 5) * 3]]);
			controller.setActiveTileType('floor');
		}
		else {
			controller.setActiveTile(this.map.tileStore.indices[this.details[x + (y - 9) * 3]]);
			controller.setActiveTileType('detail');
		}
	}

	elemHover() { /* No action */ }
	elemUnhover() { /* No action */ }

	private addWall(tileset: string): void {
		this.addTilesetSprite(tileset, this.walls.length % 3, Math.floor(this.walls.length / 3) + 1, 13);
		this.walls.push(tileset);
		
		(this.getByName('add_wall') as Phaser.GameObjects.Sprite).setPosition(
			3 + ((this.walls.length) % 3 * 21),	3 + (Math.floor((this.walls.length) / 3 + 1) * 21));
	}

	private addFloor(tileset: string): void {
		this.addTilesetSprite(tileset, this.floors.length % 3, Math.floor(this.floors.length / 3) + 5, 13);
		this.floors.push(tileset);
		
		(this.getByName('add_floor') as Phaser.GameObjects.Sprite).setPosition(
			3 + ((this.floors.length) % 3 * 21),	3 + (Math.floor((this.floors.length) / 3 + 5) * 21));
	}

	private addDetail(tileset: string): void {
		this.addTilesetSprite(tileset, this.details.length % 3, Math.floor(this.details.length / 3) + 9, 33);
		this.details.push(tileset);

		(this.getByName('add_detail') as Phaser.GameObjects.Sprite).setPosition(
			3 + ((this.details.length) % 3 * 21),	3 + (Math.floor((this.details.length) / 3 + 9) * 21));
	}

	private addTilesetSprite(key: string, x: number, y: number, frame: number) {
		let spr = new Phaser.GameObjects.Sprite(this.scene, 4 + x * 21, 4 + y * 21, key, frame);
		spr.setOrigin(0);
		this.sprites.push(spr);
		this.list.push(spr);

		let spr2 = new Phaser.GameObjects.Sprite(this.scene, 3 + x * 21, 3 + y * 21, 'ui_sidebar_overlay');
		spr2.setOrigin(0);
		this.list.push(spr2);

		this.bringToTop(this.hoverSpriteCursor);
		this.bringToTop(this.activeSpriteCursor);
	}
}

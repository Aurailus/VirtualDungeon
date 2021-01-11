import * as Phaser from 'phaser';

import Sidebar from './Sidebar';

import Map from '../../map/Map';
import ModeManager from '../../mode/ModeManager';
import type InputManager from '../../InputManager';
import ArchitectMode from '../../mode/ArchitectMode';

import { Asset } from '../../util/Asset';

export default class TileSidebar extends Sidebar {
	
	walls: string[] = [];
	grounds: string[] = [];
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
		
		let add_ground = new Phaser.GameObjects.Sprite(this.scene, 3 + x * 21, 3 + y * 21, 'ui_sidebar_browse');
		add_ground.setName('add_ground');
		add_ground.setOrigin(0);
		this.add(add_ground);
		this.sprites.push(add_ground);

		for (let tileset of assets.filter((a) => a.type === 'floor'))
			this.addGround(tileset.identifier);

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
		if (y < 4) {
			(this.mode.active as ArchitectMode).activeTileset = this.map.tileStore.indices[this.walls[x + (y - 1) * 3]];
			(this.mode.active as ArchitectMode).activeLayer = 'wall';
		}
		else if (y < 8) {
			(this.mode.active as ArchitectMode).activeTileset = this.map.tileStore.indices[this.walls[x + (y - 5) * 3]];
			(this.mode.active as ArchitectMode).activeLayer = 'floor';
		}
		else {
			(this.mode.active as ArchitectMode).activeTileset = this.map.tileStore.indices[this.walls[x + (y - 9) * 3]];
			(this.mode.active as ArchitectMode).activeLayer = 'detail';
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

	private addGround(tileset: string): void {
		this.addTilesetSprite(tileset, this.grounds.length % 3, Math.floor(this.grounds.length / 3) + 5, 13);
		this.grounds.push(tileset);
		
		(this.getByName('add_ground') as Phaser.GameObjects.Sprite).setPosition(
			3 + ((this.grounds.length) % 3 * 21),	3 + (Math.floor((this.grounds.length) / 3 + 5) * 21));
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

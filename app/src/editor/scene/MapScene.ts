import * as Phaser from 'phaser';

import PingHandler from '../interact/PingHandler';
import ActionManager from '../action/ActionManager';
import InputManager from '../interact/InputManager';
import InterfaceRoot from '../interact/InterfaceRoot';

import Map from '../map/Map';
import ModeManager from '../mode/ModeManager';
import CameraControl from '../interact/CameraController';

import { Vec2 } from '../util/Vec';
import { Asset } from '../../../../common/DBStructs';
import EditorData from '../EditorData';

export default class MapScene extends Phaser.Scene {
	assets: Asset[] = [];

	private view: CameraControl = new CameraControl();
	private actions: ActionManager = new ActionManager();
	private inputManager: InputManager = new InputManager(this);

	private mode: ModeManager	= new ModeManager();
	private pingHandler = new PingHandler();
	private interface: InterfaceRoot = new InterfaceRoot();
	
	private map: Map = new Map();

	constructor() { super({ key: 'MapScene' }); }

	create(data: EditorData): void {
		this.data.set('player_tint', { h: Math.random(), s: 1, v: 1 });

		this.assets = data.assets;

		this.inputManager.init();
		this.pingHandler.init(this, this.inputManager, data.socket);
		this.view.init(this.cameras.main, this.inputManager);

		this.map.init(this, this.assets);
		if (data.map) this.map.load(data.map);
		data.socket.on('get_map', (res: (map: string) => void) => res(this.map.save()));

		this.actions.init(this, this.map, data.socket, data.onDirty);
		this.mode.init(this, data.state, this.map, data.socket, this.actions, this.assets);
		this.interface.init(this, this.inputManager, this.mode, this.actions, this.map, this.assets);
	}

	update(): void {
		this.view.update();
		this.inputManager.update();

		this.interface.update();
		this.actions.update(this.inputManager);
		this.pingHandler.update(this.view.cursorWorld);
		this.mode.update(this.view.cursorWorld, this.inputManager);

		this.map.update();

		if (this.inputManager.keyPressed('X')) {
			const cam = this.cameras.main;

			const snapSize = new Vec2(512, 512);
			const pos = new Vec2(cam.scrollX, cam.scrollY);

			this.interface.setVisible(false);
			cam.setSize(Math.min(snapSize.x, this.map.size.x * 16), Math.min(snapSize.y, this.map.size.y * 16));
			cam.centerOn(this.map.size.x / 2, this.map.size.y / 2);
			cam.setZoom(cam.width / this.map.size.x);
			
			this.game.renderer.snapshotArea(0, 0, snapSize.x, snapSize.y, (_: any) => {
				this.interface.setVisible(true);
				cam.setSize(this.game.renderer.width, this.game.renderer.height);
				this.view.moveTo(pos);
			});
		}
	}
}
 

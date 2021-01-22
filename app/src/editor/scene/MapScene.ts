import * as Phaser from 'phaser';

import InputManager from '../InputManager';
import ActionManager from '../action/ActionManager';
import InterfaceRoot from '../interface/InterfaceRoot';

import Map from '../map/Map';
import CameraControl from '../CameraControl';
import ModeManager from '../mode/ModeManager';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';
import EditorData from '../EditorData';

export default class MapScene extends Phaser.Scene {
	assets: Asset[] = [];

	view: CameraControl = new CameraControl();
	actions: ActionManager = new ActionManager();
	inputManager: InputManager = new InputManager(this);

	mode: ModeManager	= new ModeManager();
	interface: InterfaceRoot = new InterfaceRoot();
	
	size: Vec2 = new Vec2();

	map: Map = new Map();

	saved: string = '';

	constructor() { super({key: 'MapScene'}); }

	create(data: EditorData): void {
		this.assets = data.assets;

		this.inputManager.init();
		this.view.init(this.cameras.main, this.inputManager);

		this.size = new Vec2(data.campaign.maps[0].size);
		this.map.init(this, this.size, this.assets);

		const s = JSON.stringify({ size: new Vec2(32, 32) });
		this.map.load(s.length + '|' + s);

		this.mode.init(this, data.display, this.map, this.actions, this.assets);
		this.actions.init(this, this.map, data.socket);
		this.interface.init(this, data.display, this.inputManager, this.mode, this.actions, this.map, this.assets);

		// this.sound.play('mystify', { loop: true, volume: .2 });
	}

	update(): void {
		this.view.update();
		this.inputManager.update();

		this.interface.update();
		this.actions.update(this.inputManager);
		this.mode.update(this.view.cursorWorld, this.inputManager);

		this.map.update();

		if (this.inputManager.keyPressed('S')) this.saved = this.map.save();
		if (this.inputManager.keyPressed('L')) this.map.load(this.saved);
	}
}
 

import * as Phaser from 'phaser';

import InputManager from '../InputManager';
import ActionManager from '../action/ActionManager';
import InterfaceRoot from '../interface/InterfaceRoot';

import Map from '../map/Map';
import CameraControl from '../CameraControl';
import ModeManager from '../mode/ModeManager';
// import { SerializedMap } from '../map/MapSaver';

// import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';
import EditorData from '../EditorData';

export default class MapScene extends Phaser.Scene {
	assets: Asset[] = [];

	view: CameraControl = new CameraControl();
	actions: ActionManager = new ActionManager();
	inputManager: InputManager = new InputManager(this);

	mode: ModeManager	= new ModeManager();
	interface: InterfaceRoot = new InterfaceRoot();
	
	map: Map = new Map();

	constructor() { super({ key: 'MapScene' }); }

	create(data: EditorData): void {
		this.assets = data.assets;

		this.inputManager.init();
		this.view.init(this.cameras.main, this.inputManager);

		this.map.init(this, this.assets);
		if (data.map) this.map.load(data.map);

		this.actions.init(this, this.map, data.socket);
		this.mode.init(this, this.map, this.actions, this.assets);
		this.interface.init(this, this.inputManager, this.mode, this.actions, this.map, this.assets);
	}

	update(): void {
		this.view.update();
		this.inputManager.update();

		this.interface.update();
		this.actions.update(this.inputManager);
		this.mode.update(this.view.cursorWorld, this.inputManager);

		this.map.update();
	}
}
 

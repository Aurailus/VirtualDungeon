import Component from './components/Component';

import TileSidebar from './components/TileSidebar';
import LayerManager from './components/LayerManager';
import ModeSwitcher from './components/ModeSwitcher';
import TokenSidebar from './components/TokenSidebar';
import SidebarToggler from './components/SidebarToggler';
import HistoryManipulator from './components/HistoryManipulator';

import Map from '../map/Map';
import InputManager from '../InputManager';
import ModeMananger from '../mode/ModeManager';
import { TokenModeKey } from '../mode/TokenMode';
import HistoryManager from '../history/HistoryManager';
import { ArchitectModeKey } from '../mode/ArchitectMode';

import { Asset } from '../util/Asset';

const UI_OFFSET = -10000;
const CLOSED_SIDEBAR_OFFSET = -68;

export default class UIView {
	sidebarOpen: boolean = true;

	private scene: Phaser.Scene = null as any;

	private lastMode: string = ArchitectModeKey;

	private mode: ModeMananger = null as any;
	// private history: HistoryManager = null as any;
	private inputManager: InputManager = null as any;
	private camera: Phaser.Cameras.Scene2D.Camera = null as any;

	private root: Phaser.GameObjects.Container = null as any;
	private leftRoot: Phaser.GameObjects.Container = null as any;
	private rightRoot: Phaser.GameObjects.Container = null as any;
	
	private tileSidebar: TileSidebar = null as any;
	private tokenSidebar: TokenSidebar = null as any;

	init(scene: Phaser.Scene, input: InputManager, mode: ModeMananger,
		history: HistoryManager, map: Map, assets: Asset[]) {
		
		this.mode = mode;
		this.scene = scene;
		// this.history = history;
		this.inputManager = input;

		this.camera = this.scene.cameras.add(0, 0, undefined, undefined, undefined, 'ui_camera');
		this.camera.scrollX = UI_OFFSET;
		this.camera.setOrigin(0);
		this.camera.setZoom(3);

		this.root = this.scene.add.container(UI_OFFSET, 0);
		this.root.setName('root');
		this.leftRoot = this.scene.add.container(0, 0);
		this.root.add(this.leftRoot);
		this.rightRoot = this.scene.add.container(this.camera.displayWidth, this.camera.displayHeight);
		this.root.add(this.rightRoot);
		
		this.leftRoot.add(new SidebarToggler(scene, 49, 1, input, this));

		this.leftRoot.add(new ModeSwitcher(scene, 82, 1, input, mode));
		this.leftRoot.add(new HistoryManipulator(scene, 124, 1, history, input));

		this.tokenSidebar = new TokenSidebar(scene, CLOSED_SIDEBAR_OFFSET, 0, assets, input, mode);
		this.leftRoot.add(this.tokenSidebar);

		this.tileSidebar = new TileSidebar(scene, 0, 0, assets, input, mode, map);
		this.leftRoot.add(this.tileSidebar);

		this.rightRoot.add(new LayerManager(scene, { map }));
	}

	update() {
		function testActive(component: Phaser.GameObjects.GameObject) {
			if ((component as Component).mouseCollides?.()) return true;
			else if ((component as Phaser.GameObjects.Container).list)
				for (let c of (component as Phaser.GameObjects.Container).list)
					if (testActive(c)) return true;

			return false;
		}
		
		function update(component: Phaser.GameObjects.GameObject) {
			component.update();
			if ((component as Phaser.GameObjects.Container).list)
				for (let c of (component as Phaser.GameObjects.Container).list) update(c);
		}

		let uiHovered = testActive(this.root);
		this.inputManager.setContext(uiHovered ? 'interface' : 'map');

		if (this.inputManager.keyPressed('TAB')) this.mode.activate(
			this.mode.getActive() === ArchitectModeKey ? TokenModeKey : ArchitectModeKey);

		if (this.lastMode !== this.mode.getActive()) {
			this.lastMode = this.mode.getActive();
			switch (this.lastMode) {
			default: break;
			case ArchitectModeKey:
				this.displayArchitectMode();
				this.hideTokenMode();
				break;
			
			case TokenModeKey:
				this.hideArchitectMode();
				this.displayTokenMode();
				break;
			}
		}

		update(this.root);
	}

	toggleSidebarOpen() {
		let sidebarOpen = !this.sidebarOpen;
		
		this.scene.tweens.add({
			targets: this.leftRoot,
			ease: 'Cubic',
			duration: 225,
			repeat: 0,
			
			x: {
				from: (sidebarOpen ? CLOSED_SIDEBAR_OFFSET : 0),
				to: (sidebarOpen ? 0 : CLOSED_SIDEBAR_OFFSET)
			}
		});

		this.scene.tweens.add({
			targets: [this.tileSidebar, this.tokenSidebar],
			ease: 'Cubic',
			duration: 225,
			repeat: 0,

			alpha: { from: (sidebarOpen ? 0 : 2.5), to: (sidebarOpen ? 1 : 0) }
		});

	  // Hack to prevent multiple UI items from triggering.
	  // TODO: This comment was written half a year ago and I have no idea what it means. Verify somehow?
		setTimeout(() => this.sidebarOpen = sidebarOpen, 0);
	}

	private displayArchitectMode() {
		this.leftRoot.bringToTop(this.tileSidebar);
		this.scene.tweens.add({
			targets: this.tileSidebar,
			ease: 'Cubic',
			duration: 300,

			x: { from: CLOSED_SIDEBAR_OFFSET, to: 0 }
		});
	}

	private hideArchitectMode() {
		this.scene.tweens.add({
			targets: this.tileSidebar,
			ease: 'Cubic',
			duration: 300,

			x: { from: 0, to: CLOSED_SIDEBAR_OFFSET / 2 }
		});
	}

	private displayTokenMode() {
		this.leftRoot.bringToTop(this.tokenSidebar);
		this.scene.tweens.add({
			targets: this.tokenSidebar,
			ease: 'Cubic',
			duration: 300,

			x: { from: CLOSED_SIDEBAR_OFFSET, to: 0 }
		});
	}

	private hideTokenMode() {
		this.scene.tweens.add({
			targets: this.tokenSidebar,
			ease: 'Cubic',
			duration: 300,

			x: { from: 0, to: CLOSED_SIDEBAR_OFFSET / 2 }
		});
	}
}

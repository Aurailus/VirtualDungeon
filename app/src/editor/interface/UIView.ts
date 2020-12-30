import type MapScene from '../scene/MapScene';
import UIComponent from './components/UIComponent';

import UITileSidebar from './components/UITileSidebar';
import UITokenSidebar from './components/UITokenSidebar';
import UITokenProps from './components/UITokenProps';
import UISidebarToggle from './components/UISidebarToggle';
import UIModeSwitchButton from './components/UIModeSwitchButton';
import UIHistoryManipulation from './components/UIHistoryManipulation';

import { Asset, AssetType } from '../util/Asset';

export default class UIView {
	scene: MapScene;
	camera: Phaser.Cameras.Scene2D.Camera | null = null;

	o?: Phaser.GameObjects.Container;

	visibleMenu: number = 0;
	uiActive: boolean = false;

	tileSidebar?: UITileSidebar;
	tokenSidebar?: UITokenSidebar;
	tokenProps?: UITokenProps;

	sidebarOpen: boolean = true;

	constructor(scene: MapScene) {
		this.scene = scene;
	}

	init(assets: Asset[]) {
		this.camera = this.scene.cameras.add(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height, false, 'ui_camera');
		this.camera.scrollX = -10000;

		this.o = this.scene.add.container(-10000, 0);

		this.o.add(new UISidebarToggle(this.scene, 16, 1));

		this.o.add(new UIModeSwitchButton(this.scene, 28, 1));
		this.o.add(new UIHistoryManipulation(this.scene, 43, 1));

		this.tokenSidebar = new UITokenSidebar(this.scene, -205, 0);
		this.o.add(this.tokenSidebar);
		for (let token of assets.filter((a) => a.type === AssetType.TOKEN))
			this.tokenSidebar.addToken(token.key);

		this.tileSidebar = new UITileSidebar(this.scene, 0, 0, assets);
		this.o.add(this.tileSidebar);

		this.tokenProps = new UITokenProps(this.scene, 24, 0);
		this.tokenProps.y = this.camera.height;
		this.o.add(this.tokenProps);
	}

	toggleSidebarOpen() {
		let sidebarOpen = !this.sidebarOpen;
		
		this.scene.tweens.add({
			targets: this.o,
			x: {from: (sidebarOpen ? -10204 : -10000), to: (sidebarOpen ? -10000 : -10204)},
			ease: 'Cubic',
			duration: 225,
			repeat: 0
		});

		this.scene.tweens.add({
			targets: [this.tileSidebar, this.tokenSidebar],
			alpha: {from: (sidebarOpen ? 0 : 2.5), to: (sidebarOpen ? 1 : 0)},
			ease: 'Cubic',
			duration: 225,
			repeat: 0
		});

		setTimeout(() => this.sidebarOpen = sidebarOpen, 0); // Hack to prevent multiple UI items from triggering.
	}

	update() {
		if (!this.o) return;

		this.uiActive = false;
		for (let o of this.o.list) {
			o.update();
			if (!this.uiActive && (o as UIComponent).mouseIntersects()) this.uiActive = true;
		}

		if (this.visibleMenu !== this.scene.mode) {
			this.visibleMenu = this.scene.mode;
			if (this.scene.mode === 0) {
				this.displayArchitect();
				this.hideToken();
			}
			else {
				this.hideArchitect();
				this.displayToken();
			}
		}

		if (this.scene.i.keyPressed('TAB')) this.scene.mode = (this.scene.mode === 0 ? 1 : 0);

		if (this.scene.mode === 0) {
			if (this.uiActive) this.scene.architect.cleanup();
			else {
				this.scene.architect.update();
				this.scene.token.cleanup();
			}
		}
		else {
			if (this.uiActive) this.scene.token.cleanup();
			else {
				this.scene.token.update();
				this.scene.architect.cleanup();
			}
		}
	}

	displayArchitect() {
		if (!this.o || !this.tileSidebar || !this.tokenSidebar || !this.camera) return;

		this.o.bringToTop(this.tileSidebar);
		this.tileSidebar.x = -205;
		this.scene.tweens.add({
			targets: this.tileSidebar,
			x: {from: -205, to: 0},
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
	}

	hideToken() {
		if (!this.o || !this.tileSidebar || !this.tokenSidebar || !this.camera) return;

		this.scene.tweens.add({
			targets: this.tokenSidebar,
			x: {from: 0, to: -60},
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});

		this.scene.tweens.add({
			targets: this.tokenProps,
			alpha: 0,
			y: this.camera.height,
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
	}

	displayToken() {
		if (!this.o || !this.tileSidebar || !this.tokenSidebar || !this.tokenProps || !this.camera) return;

		this.o.bringToTop(this.tokenSidebar);
		this.tokenSidebar.x = -205;
		this.scene.tweens.add({
			targets: this.tokenSidebar,
			x: {from: -205, to: 0},
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});

		this.o.bringToTop(this.tokenProps);
		this.scene.tweens.add({
			targets: this.tokenProps,
			alpha: 1,
			y: this.camera.height - 400 - 9,
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
	}

	hideArchitect() {
		this.scene.tweens.add({
			targets: this.tileSidebar,
			x: {from: 0, to: -60},
			ease: 'Cubic',
			duration: 300,
			repeat: 0
		});
	}
}

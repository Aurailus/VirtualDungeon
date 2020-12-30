import * as Phaser from 'phaser';

import UIView from '../interface/UIView';
import InputManager from '../InputManager';
import AssetUploader from '../interface/AssetUploader';
import HistoryManager from '../history/HistoryManager';

import WorldView from '../WorldView';
import TokenMode from '../TokenMode';
import ArchitectMode from '../ArchitectMode';

import Token from '../Token';
import MapData from '../MapData';
import Lighting from '../lighting/Lighting';

// import OutlinePipeline from '../shader/OutlinePipeline';
// import BrightenPipeline from '../shader/BrightenPipeline';

import { Vec2 } from '../util/Vec';
import { Asset } from '../util/Asset';

export default class MapScene extends Phaser.Scene {
	assets: Asset[] | null = null;

	i: InputManager = new InputManager(this);
	history: HistoryManager = new HistoryManager(this);
	view: WorldView = new WorldView(this);

	ui: UIView = new UIView(this);
	architect: ArchitectMode = new ArchitectMode(this);
	token: TokenMode = new TokenMode(this);

	size: Vec2 = new Vec2();

	map: MapData = new MapData(this);
	lighting: Lighting = new Lighting(this);

	mode: number = 0;
	tokens: Token[] = [];

	constructor() {
		super({key: 'MapScene'});
	}

	init(assets: Asset[]): void {
		this.assets = assets;
	}

	preload(): void {
		// window.addEventListener('resize', () => {
		// 	let frame = document.getElementById('root')!;
		// 	this.game.scale.resize(frame.offsetWidth, frame.offsetHeight);
		// });
	}

	create(): void {
		// const webRenderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
		// webRenderer.pipelines.add('outline',  new OutlinePipeline(this.game));
		// webRenderer.pipelines.add('brighten', new BrightenPipeline(this.game));

		this.i.init();
		this.view.init();

		this.size = new Vec2(64, 64);
		this.map.init(this.size, this.assets!);

		this.ui.init(this.assets!);
		this.architect.init();
		this.token.init();

		this.lighting.init(this.size);
	}

	update(): void {
		this.i.update();
		this.history.update();
		this.view.update();

		this.ui.update();

		this.map.update();
		this.lighting.update();

		if (this.i.keyPressed('U')) {
			new AssetUploader(this);
		}
	}
}
 

import * as Phaser from 'phaser';

import * as Patch from '../Patch';

import OutlinePipeline from '../shader/OutlinePipeline';
import BrightenPipeline from '../shader/BrightenPipeline';

import EditorData from '../EditorData';

export default class LoadScene extends Phaser.Scene {
	editorData: EditorData = null as any;

	constructor() { super({ key: 'LoadScene' }); }

	init(data: EditorData) {
		this.editorData = data;
	}

	preload() {
		this.load.on('progress', (val: number) => this.editorData.onProgress(0.25 + (val * 0.7)));

		this.load.setBaseURL('/app');
		this.load.setPath('/static/editor');

		this.load.image('cursor');
		this.load.image('grid_tile');
		this.load.image('erase_tile');
		this.load.image('user_highlight');

		this.load.image('light_tint');
		this.load.image('light_base');

		this.load.setPrefix('ui_');

		this.load.image('quick_selector');
		this.load.image('sidebar_cursor');
		this.load.image('sidebar_browse');
		this.load.image('sidebar_overlay');
		
		this.load.spritesheet('mode_switch', undefined, {frameWidth: 39, frameHeight: 18});
		this.load.spritesheet('history_manipulation', undefined, {frameWidth: 39, frameHeight: 18});
		
		this.load.spritesheet('sidebar_bg', undefined, {frameWidth: 68, frameHeight: 21});
		this.load.spritesheet('select_cursor', undefined, {frameWidth: 21, frameHeight: 18});
		this.load.spritesheet('sidebar_toggle', undefined, {frameWidth: 30, frameHeight: 18});

		this.load.spritesheet('slider_icons', undefined, {frameWidth: 12, frameHeight: 12});

		this.load.setPrefix('');
		this.load.setPath('');

		this.load.image('shader_light_mask', '/static/editor/light_mask.png');

		this.load.setPath('/asset/');

		for (let a of this.editorData!.assets) {
			if (a.type === 'token') {
				const fw = a.imageSize.x / (a.tokenType === 4 ? 2 : a.tokenType === 8 ? 3 : 1);
				this.load.spritesheet(a.identifier, a.path, { frameWidth: fw, frameHeight: fw });
			}
			else if (a.type === 'wall' || a.type === 'detail' || a.type === 'floor')
				this.load.image(a.identifier, a.path);
		}
	}

	async create() {
		const glRenderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
		glRenderer.pipelines.add('brighten', new BrightenPipeline(this.game));
		glRenderer.pipelines.add('outline',  new OutlinePipeline(this.game));

		await Promise.all(this.editorData!.assets.map(a => {
			if (a.type === 'token')
				return Patch.sprite(this, a.identifier, a.tokenType === 4 ? 2 : a.tokenType === 8 ? 3 : 1);

			else if (a.type === 'wall' || a.type === 'detail')
				// TODO: Tilesize needs to come back!)
				Patch.tileset(this, a.identifier, 16);

			else if (a.type === 'floor')
				// TODO: Tilesize needs to come back!
				Patch.floor(this, a.identifier, 16);

			return new Promise<void>(resolve => resolve());
		}));

		await Patch.tileset(this, 'user_highlight', 16);

		this.editorData.onProgress(undefined);

		this.game.scene.start('MapScene', this.editorData);
		this.game.scene.stop('LoadScene');
		this.game.scene.swapPosition('MapScene', 'LoadScene');
	}
}
 

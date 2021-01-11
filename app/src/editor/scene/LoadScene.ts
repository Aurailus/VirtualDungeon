import * as Phaser from 'phaser';

import * as Patch from '../Patch';

import OutlinePipeline from '../shader/OutlinePipeline';
import BrightenPipeline from '../shader/BrightenPipeline';

import { Asset } from '../util/Asset';
import EditorData from '../EditorData';

export default class LoadScene extends Phaser.Scene {
	assets: Asset[] = [];
	editorData: EditorData | undefined;

	loaderOutline: Phaser.GameObjects.Sprite | null = null;
	loaderFilled: Phaser.GameObjects.Sprite | null = null;

	constructor() { super({ key: 'LoadScene' }); }

	init(data: EditorData) {
		this.editorData = data;
	}

	preload() {
		this.cameras.main.setBackgroundColor('#090d24');

		this.loaderOutline = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'loader_unfilled', 0);
		this.loaderFilled = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'loader_filled', 0);

		this.loaderOutline.setScale(6);
		this.loaderFilled.setScale(6);

		this.load.on('progress', (val: number) => {
	 		this.loaderFilled!.setCrop(0, this.loaderFilled!.height - this.loaderFilled!.height * val,
				this.loaderFilled!.width, this.loaderFilled!.height * val);
		});

		this.load.image('cursor', '/app/static/cursor.png');
		this.load.image('grid_tile', '/app/static/grid_tile.png');
		this.load.image('erase_tile', '/app/static/erase_tile.png');

		this.load.image('ui_button_grid', '/app/static/ui/button_grid.png');
		this.load.spritesheet('ui_button_side_menu', '/app/static/ui/button_side_menu.png', {frameWidth: 21, frameHeight: 18});
		this.load.spritesheet('ui_history_manipulation', '/app/static/ui/history_manipulation.png', {frameWidth: 39, frameHeight: 18});
		this.load.spritesheet('ui_mode_switch', '/app/static/ui/mode_switch.png', {frameWidth: 39, frameHeight: 18});
		this.load.image('ui_quick_selector', '/app/static/ui/quick_selector.png');
		this.load.spritesheet('ui_sidebar_bg', '/app/static/ui/sidebar_bg.png', {frameWidth: 68, frameHeight: 21});
		this.load.image('ui_sidebar_cursor', '/app/static/ui/sidebar_cursor.png');
		this.load.image('ui_sidebar_overlay', '/app/static/ui/sidebar_overlay.png');
		this.load.spritesheet('ui_button_select_cursor', '/app/static/ui/button_select_cursor.png', {frameWidth: 21, frameHeight: 18});
		this.load.spritesheet('ui_background_9x', '/app/static/ui/slice/background.png', {frameWidth: 6, frameHeight: 6});
		this.load.image('ui_sidebar_browse', '/app/static/ui/sidebar_browse.png');
		this.load.spritesheet('ui_button_sidebar_toggle', '/app/static/ui/button_sidebar_toggle.png', {frameWidth: 30, frameHeight: 18});

		this.load.image('shader_light_mask', '/app/static/shader/light_mask.png');

		this.assets = JSON.parse(this.cache.text.get('assets'));

		for (let a of this.assets) {
			if (a.type === 'token' || a.type === 'floor') {
				this.load.spritesheet(a.identifier, '/app/asset/' + a.path, { frameWidth: a.tileSize, frameHeight: a.tileSize });
			}
			else if (a.type === 'wall' || a.type === 'detail')
				this.load.image(a.identifier, '/app/asset/' + a.path);
		}
	}

	create() {
		this.loaderOutline!.destroy();
		this.loaderFilled!.setTexture('loader_patching');

		const glRenderer = this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
		glRenderer.pipelines.add('brighten', new BrightenPipeline(this.game));
		glRenderer.pipelines.add('outline',  new OutlinePipeline(this.game));

		Promise.all(this.assets.map(a => {
			if (a.type === 'token')
				return Patch.sprite(this, a.identifier, Math.floor(a.dimensions!.x / a.tileSize));

			else if (a.type === 'wall' || a.type === 'detail')
				return Patch.tileset(this, a.identifier, a.tileSize);

			else return new Promise<void>(resolve => resolve());
		})).then(() => {
			this.game.scene.start('MapScene', { ...this.editorData,
				data: JSON.parse(this.cache.text.get('data')), assets: this.assets });
			this.cache.text.remove('assets');
			this.game.scene.stop('LoadScene');
			this.game.scene.swapPosition('MapScene', 'LoadScene');
		});
	}
}
 

import * as Phaser from 'phaser';

import EditorData from '../EditorData';

export default class InitScene extends Phaser.Scene {
	private editorData: EditorData | undefined;

	constructor() { super({key: 'InitScene'}); }

	init(data: EditorData) {
		this.editorData = data;
	}

	preload() {
		this.cameras.main.setBackgroundColor('#090d24');

		this.load.spritesheet('loader_filled',   '/app/static/loader/loader_filled.png',   { frameWidth: 18, frameHeight: 18 });
		this.load.spritesheet('loader_unfilled', '/app/static/loader/loader_unfilled.png', { frameWidth: 18, frameHeight: 18 });
		this.load.spritesheet('loader_patching', '/app/static/loader/loader_patching.png', { frameWidth: 18, frameHeight: 18 });

		this.load.text('data', `/data/map/${this.editorData!.campaign}/${this.editorData!.map}`);
		this.load.text('assets', `/data/assets/${this.editorData!.campaign}`);
	}

	create(): void {
		this.game.scene.start('LoadScene', this.editorData);
		this.game.scene.stop('InitScene');
		this.game.scene.swapPosition('LoadScene', 'InitScene');
	}
}
 

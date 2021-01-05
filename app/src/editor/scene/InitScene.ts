import * as Phaser from 'phaser';

import EditorData from '../EditorData';

export default class InitScene extends Phaser.Scene {
	constructor() {
		super({key: 'InitScene'});
	}

	preload() {
		this.cameras.main.setBackgroundColor('#090d24');

		this.load.image('logo', '/app/static/loader/logo.png');
		this.load.spritesheet('loader_filled', '/app/static/loader/loader_filled.png', {frameWidth: 18, frameHeight: 18});
		this.load.spritesheet('loader_unfilled', '/app/static/loader/loader_unfilled.png', {frameWidth: 18, frameHeight: 18});

		const url = window.location.pathname.split('/');
		const campaign = url[url.length - 2];
		const map = url[url.length - 1];

		this.load.text('data', `/data/map/${campaign}/${map}`);
		this.load.text('assets', `/data/assets/${campaign}`);
	}

	create(data: EditorData): void {
		this.game.scene.start('LoadScene', data);
		this.game.scene.stop('InitScene');
		this.game.scene.swapPosition('LoadScene', 'InitScene');
	}
}
 

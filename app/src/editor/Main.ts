import Phaser from 'phaser';

import { ExternalData } from './EditorData';
import * as Scene from './scene/Scenes';

export default function create(root: HTMLElement, data: ExternalData) {
	const bounds = root.getBoundingClientRect();

	const game = new Phaser.Game({
		title: 'Editor',

		parent: root,
		width: bounds.width,
		height: bounds.height,

		scene: Scene.list,

		render: {
			antialias: false
		},
		fps: { target: 60 },
		physics: {
			default: 'arcade',
			arcade: {
				debug: false
			}
		}
	});

	game.scene.start('InitScene', data);
	return game;
}

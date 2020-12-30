import Phaser from 'phaser';

import * as Scene from './scene/Scenes';

export default function create(root: HTMLElement) {
	const bounds = root.getBoundingClientRect();

	return new Phaser.Game({
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
}

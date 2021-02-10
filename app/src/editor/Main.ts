import Phaser from 'phaser';

import * as Scene from './scene/Scenes';

export default function create(root: HTMLElement, user: string, identifier: string, mapIdentifier: string | undefined,
	onProgress: (progress: number) => void, onDirty: (dirty: boolean) => void) {
	
	const bounds = root.getBoundingClientRect();

	const game = new Phaser.Game({
		disableContextMenu: true,
		render: { antialias: false },
		banner: { hidePhaser: true },

		parent: root,
		width: bounds.width,
		height: bounds.height,

		scene: Scene.list
	});

	game.scene.start('InitScene', { user, identifier, mapIdentifier, onProgress, onDirty });
	return game;
}

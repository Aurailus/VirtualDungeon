import Phaser from 'phaser';
import { io } from 'socket.io-client';

import * as Scene from './scene/Scenes';

export default function create(root: HTMLElement, onProgress: (progress: number) => void, user: string, identifier: string) {
	const bounds = root.getBoundingClientRect();

	const socket = io();

	const game = new Phaser.Game({
		disableContextMenu: true,
		render: { antialias: false },
		banner: { hidePhaser: true },

		parent: root,
		width: bounds.width,
		height: bounds.height,

		scene: Scene.list
	});

	game.scene.start('InitScene', { user, onProgress, identifier, socket });
	return game;
}

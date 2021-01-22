import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import { Asset, Campaign } from '../../../../common/DBStructs';

async function emit<R = any>(socket: IO.Socket, event: string, data?: any): Promise<R> {
	return new Promise<R>((resolve) => {
		socket.emit(event, data, resolve);
	});
}

export default class InitScene extends Phaser.Scene {
	constructor() { super({key: 'InitScene'}); }

	async create({ user, onProgress, identifier, socket }: {
		user: string; onProgress: (progress: number) => void; identifier: string; socket: IO.Socket; }) {

		let res: { state: true; campaign: Campaign; assets: Asset[] } | { state: false; error?: string }
			= await emit(socket, 'room_init', identifier);
		let display = res.state ? 'edit' : 'view';

		if (!res.state) res =
			await emit(socket, 'room_join', { user, identifier }) as { state: true; campaign: Campaign; assets: Asset[] };

		socket.on('disconnect', () => console.log('Disconnected!!!'));
		
		this.scene.start('LoadScene', {
			user,
			identifier,
			onProgress,
			socket,
			display,
			assets: res.assets,
			campaign: res.campaign });

		this.game.scene.stop('InitScene');
		this.game.scene.swapPosition('LoadScene', 'InitScene');
	}
}
 

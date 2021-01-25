import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import { Asset, Campaign } from '../../../../common/DBStructs';

async function emit<R = any>(socket: IO.Socket, event: string, data?: any): Promise<R> {
	return new Promise<R>((resolve) => {
		socket.emit(event, data, resolve);
	});
}

interface InitProps {
	user: string;
	identifier: string;
	mapIdentifier?: string;

	onProgress: (progress: number) => void;
}

export default class InitScene extends Phaser.Scene {
	private socket: IO.Socket = IO.io();

	constructor() { super({key: 'InitScene'}); }

	async create({ user, onProgress, identifier, mapIdentifier }: InitProps) {
		this.socket.on('disconnect', this.onDisconnect);
		this.game.events.addListener('destroy', this.onDestroy);

		const { res, map } = await this.onConnect(user, identifier, mapIdentifier);

		this.scene.start('LoadScene', {
			socket: this.socket,
			user, identifier,
			...res, map,
			
			onProgress
		});

		this.game.scene.stop('InitScene');
		this.game.scene.swapPosition('LoadScene', 'InitScene');
	}

	private onDestroy = async () => {
		this.socket.off('disconnect', this.onDisconnect);
		this.socket.disconnect();
		console.log('Destroyed!');
	};

	private onDisconnect = async () => {
		console.log('Disconnected!!!');
	};

	private onConnect = async (user: string, identifier: string, mapIdentifier: string | undefined):
	Promise<{ res: { campaign: Campaign; assets: Asset[] }; map: string | undefined }> => {
		
		let res: { state: true; campaign: Campaign; assets: Asset[] } | { state: false; error?: string }
			= await emit(this.socket, 'room_init', identifier);

		let map: string | undefined;
		if (res.state) map = (mapIdentifier ? res.campaign.maps.filter(m => m.identifier === mapIdentifier)[0] : res.campaign.maps[0]).data;
		else res = await emit(this.socket, 'room_join', { user, identifier }) as { state: true; campaign: Campaign; assets: Asset[] };

		return { res, map };
	};
}

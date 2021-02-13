import * as Phaser from 'phaser';
import * as IO from 'socket.io-client';

import EditorData from '../EditorData';
import { Asset, Campaign } from '../../../../common/DBStructs';

async function emit<R = any>(socket: IO.Socket, event: string, data?: any): Promise<R> {
	return new Promise<R>((resolve) => {
		socket.emit(event, data, resolve);
	});
}

type Error = { state: false; error?: string };
type SocketData = Omit<EditorData, 'socket' | 'onDirty' | 'onProgress'>;
type Response = { state: true; campaign: Campaign; assets: Asset[]; map?: string };

interface InitProps {
	user: string;
	identifier: string;
	mapIdentifier?: string;

	onDirty: (dirty: boolean) => void;
	onProgress: (progress: number) => void;
}

export default class InitScene extends Phaser.Scene {
	private socket: IO.Socket = IO.io();
	private status: Phaser.GameObjects.Text = null as any;

	constructor() { super({key: 'InitScene'}); }

	async create({ user, onProgress, onDirty, identifier, mapIdentifier }: InitProps) {
		this.socket.on('disconnect', this.onDisconnect);
		this.game.events.addListener('destroy', this.onDestroy);

		this.status = this.add.text(8, 12, 'Establishing connection to server...',
			{ fontFamily: 'sans-serif', fontSize: '20px', color: '#666' });

		let data: SocketData | undefined;
		const res = await emit<Response | Error>(this.socket, 'room_init', identifier);
		if (res.state) {
			data = { ...res, state: 'owner', map:
				(res.campaign.maps.filter(m => m.identifier === mapIdentifier)[0] ?? res.campaign.maps[0]).data };
		}
		else {
			this.status.setText(this.status.text + '\nAttempting to join game...');
			try { data = await this.attemptJoin(user, identifier); }
			catch (e) {
				this.status.setText(this.status.text + '\nFailed to join game: ' + e + '\nReload to try again.');
				return;
			}
		}

		this.scene.start('LoadScene', {
			socket: this.socket,
			// user, identifier,
			onProgress, onDirty,
			...data
		} as EditorData);

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

	private attemptJoin = async (user: string, identifier: string,
		maxAttempts: number = 3, delay: number = 1000): Promise<SocketData> => {
		return new Promise<SocketData>((resolve, reject) => {
			let attempts = 0;

			const makeQuery = async () => {
				const res = await emit<Response | Error>(this.socket, 'room_join', { user, identifier });
				if (res.state) {
					this.status.setText(this.status.text + '\nSuccessfully connected.');
					resolve({ ...res, state: 'player' });
				}
				else {
					this.status.setText(this.status.text + '\n' + res.error);
					if (attempts++ <= maxAttempts) {
						this.status.setText(this.status.text + ' Retrying.');
						setTimeout(makeQuery, delay);
					}
					else reject('Timed out.');
				}
			};

			makeQuery();
		});
	};
}

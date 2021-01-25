import IO from 'socket.io';
import { parse as parseCookies } from 'cookie';

import Database from './Database';
import { Asset, Campaign } from '../../common/DBStructs';

export default class MapController {
	private io: IO.Server = null as any;
	private activeRooms: Set<string> = new Set();
	
	constructor(private db: Database) {}

	async init(io: IO.Server)	{
		this.io = io;

		io.on('connection', async (socket: IO.Socket) => {
			try {
				const user = await this.db.authUser({ cookies: parseCookies((socket.handshake.headers as any).cookie) });
				
				socket.on('disconnect', this.onDisconnect.bind(this, user));
				socket.on('room_init', this.initRoom.bind(this, socket, user));
				socket.on('room_join', this.joinRoom.bind(this, socket, user));

				this.onConnect(user);
			}
			catch (e) { socket.disconnect(); }
		});
	}

	private onConnect(user: string) {
		console.log(user, 'connected.');
	}

	private onDisconnect(user: string) {
		console.log(user, 'disconnected.');
	}

	private async initRoom(socket: IO.Socket, user: string, camID: string,
		res: (res: { state: true; assets: Asset[]; campaign: Campaign } | { state: false; error?: string }) => void) {
		if (typeof res !== 'function') return;

		try {
			if (typeof camID !== 'string') throw 'Missing required parameters.';
			const campaign = await this.db.getCampaign(user, camID);
			
			const identifier = user + ':' + camID;
			if (this.activeRooms.has(identifier)) throw 'Room already open.';
				
			if (!socket.disconnected) {
				this.activeRooms.add(identifier);
				socket.join(identifier);
				socket.on('disconnecting', this.destroyRoom.bind(this, socket, identifier));
				this.initRoomOwner(socket, user, camID);

				res({ state: true, assets: await this.db.getCampaignAssets(user, camID), campaign });
			}
		}
		catch (error) {
			if (typeof error === 'string') res({ state: false, error });
			else {
				console.log(error);
				res({ state: false, error: 'Internal server error.' });
			}
		}
	}

	private async joinRoom(socket: IO.Socket, _: string, { user: camUser, identifier: camID }: { user: string, identifier: string },
		res: (res: { state: true; assets: Asset[]; campaign: Campaign } | { state: false; error?: string }) => void) {
		if (typeof res !== 'function') return;
		try {
			if (typeof camID !== 'string' || typeof camUser !== 'string') throw 'Missing required parameters.';
			const campaign = await this.db.getCampaign(camUser, camID);
			
			const identifier = camUser + ':' + camID;
			if (!this.activeRooms.has(identifier)) throw 'Room is not open.';
				
			socket.join(identifier);
			// this.initRoom(socket, user, camIdentifier);

			res({ state: true, assets: await this.db.getCampaignAssets(camUser, camID), campaign });
		}
		catch (error) {
			if (typeof error === 'string') res({ state: false, error });
			else {
				console.log(error);
				res({ state: false, error: 'Internal server error.' });
			}
		}
	}

	private destroyRoom(socket: IO.Socket, identifier: string) {
		Array.from(this.io.sockets.sockets.values()).filter(s => s !== socket &&
			s.rooms.has(identifier)).forEach(s => s.disconnect());

		this.activeRooms.delete(identifier);
	}

	private initRoomOwner(socket: IO.Socket, user: string, campaign: string) {
		const room = user + ':' + campaign;

		// socket.on('map_load', this.mapLoad.bind(this, user));

		socket.on('action', this.onAction.bind(this, socket, room));
		socket.on('serialize', this.onSerialize.bind(this, user, campaign));
		// socket.on('get_campaign_assets', this.onGetCampaignAssets.bind(this, user));
	}

	private onAction(socket: IO.Socket, room: string, event: any) {
		socket.in(room).emit('action', event);
	}

	private onSerialize(user: string, campaign: string, map: string, data: string) {
		this.db.setMap(user, campaign, map, data);
	}

	// private async mapLoad(user: string, identifier: { campaign: string, map: string }, res: (data: string) => void) {
	// 	if (typeof res !== 'function' || typeof identifier !== 'object' ||
	// 		typeof identifier.map !== 'string' || typeof identifier.campaign !== 'string') return;

	// 	res(await this.db.getMap(user, identifier.campaign, identifier.map));
	// }

	// private async onGetCampaignAssets(user: string, campaign: string, res: (assets: Asset[]) => void) {
	// 	if (typeof campaign !== 'string' || typeof res !== 'function') return;

	// 	res(await this.db.getCampaignAssets(user, campaign));
	// }
}

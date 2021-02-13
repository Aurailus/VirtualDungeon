// import { Asset } from './util/Asset';
import { Socket } from 'socket.io-client';
import * as DB from '../../../common/DBStructs';

export default interface EditorData {
	socket: Socket;
	state: 'owner' | 'player';

	map?: string;
	assets: DB.Asset[];
	campaign: DB.Campaign;

	onDirty: (dirty: boolean) => void;
	onProgress: (progress: number | undefined) => void;
}

import { Asset } from './util/Asset';
import { Socket } from 'socket.io-client';
import * as DB from '../../../common/DBStructs';

export interface ExternalData {
	identifier: string;
	socket: Socket;
}

export default interface EditorData extends ExternalData {
	campaign: DB.Campaign;
	assets: Asset[];
	map: DB.Map;

	display: 'edit' | 'view';
	onProgress: (progress: number | undefined) => void;
}

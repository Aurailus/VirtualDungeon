import { Asset } from './util/Asset';
import { Socket } from 'socket.io-client';
import * as DB from '../../../common/DBStructs';

export default interface EditorData {
	socket: Socket;

	campaign: DB.Campaign;
	assets: Asset[];
	map?: string;

	onDirty: (dirty: boolean) => void;
	onProgress: (progress: number | undefined) => void;
}

import { Asset } from './util/Asset';
import * as DB from '../../../common/DBStructs';

export interface ExternalData {
	map: string;
	campaign: string;
}

export default interface EditorData extends ExternalData {
	assets: Asset[];
	data: DB.Map;
}

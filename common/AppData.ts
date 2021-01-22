import * as DB from './DBStructs';

export type AppDataSpecifier = 'user' | 'campaigns' | 'collections' | 'assets';

export interface AppData {
	user: { user: string, name: string };
	collections: DB.AssetCollection[];
	campaigns: DB.UserCampaign[];
	assets: DB.Asset[];
}

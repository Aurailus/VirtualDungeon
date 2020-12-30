import * as DB from './DBStructs';

export type AppDataSpecifier = 'user' | 'campaigns';

export interface AppData {
	user: { user: string, name: string };
	campaigns: DB.Campaign[];
}

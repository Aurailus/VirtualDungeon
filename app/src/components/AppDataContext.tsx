import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { AppData, AppDataSpecifier } from '../../../common/AppData';

export interface AppDataContextData {
	data: Partial<AppData>;
	mergeData(data: Partial<AppData>): void;
}

export const AppDataContext = Preact.createContext<AppDataContextData>({
	data: {}, mergeData: () => { throw 'Accessed default AppContext'; }});

export async function updateAppData(mergeData: (data: Partial<AppData>) => void,
	refresh: AppDataSpecifier | AppDataSpecifier[]) {
	
	const refreshArray = Array.isArray(refresh) ? refresh : [ refresh ];
	const res = await fetch('/data/app/' + refreshArray.join('&'), { cache: 'no-cache' });
	
	if (res.status !== 200) {
		Cookie.remove('tkn');
		location.href = '/app';
		throw 'Invalid token';
	}
	else {
		const data = await res.json();
		mergeData(data);
		return data;
	}
};

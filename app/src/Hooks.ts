import { useEffect, useContext } from 'preact/hooks';

import { AppData, AppDataSpecifier } from '../../common/AppData';
import { AppDataContext, updateAppData } from './components/AppDataContext';

/**
 * Provides access to the AppDataContext through a hook.
 * Returns three values, the first being the data currently stored in the context,
 * the second being a method to refresh data based on site data specifiers,
 * and the third being a method to manually merge some data grabbed from another source,
 * such as a server route that returns site data.
 *
 * Additionally, parameters may be provided to this hook to automatically refresh site data.
 * If a site data specifier or array of specifiers are passed into the hook, said data will be queried internally
 * by an internal effect whenever the dependents change. If no dependents are specified, the query will only run
 * on the initial mount. This diverges from the useEffect pattern because the hook depends on the context and the
 * effect updates the context, so having no dependents would result in an infinite loop.
 *
 * @param {AppDataSpecifier | AppDataSpecifier[]} refresh - An optional set of specifiers to refresh inside of an effect.
 * @param {any[]} dependents - An optional set of dependents to watch if the previous parameter is set.
 * @returns a reference to the context data, a method to refresh the context data, and a method to merge the context data, in a tuple.
 */

export function useAppData(refresh?: AppDataSpecifier | AppDataSpecifier[], dependents?: any[]):
[ Partial<AppData>, (refresh: AppDataSpecifier | AppDataSpecifier[]) => Promise<Partial<AppData>>,
	(data: Partial<AppData>) => void ] {

	const ctx = useContext(AppDataContext);

	useEffect(() => {
		if (refresh) updateAppData(ctx.mergeData, refresh);
	}, dependents ?? []);

	return [ ctx.data, updateAppData.bind(undefined, ctx.mergeData), ctx.mergeData ];
}

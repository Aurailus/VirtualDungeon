import * as Preact from 'preact';
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


/**
 * Calls onCancel if a click event is triggered on an element that is not a child of the currently ref'd popup.
 * Optionally, a condition function can be supplied, and the cancel test will only occur if the function returns true.
 * Any dependents for the condition function can be supplied in the dependents array,
 * this hook will automatically handle depending on the current popup, cancel function, and condition function.
 *
 * @param {Preact.RefObject<any>} roots - A ref of elements to exclude from outside-clicks.
 * @param {Function} onCancel - The function to call if a click occurs outside of `popup`.
 * @param {Function} condition - An optional function to determine whether or not to run the click test.
 * @param {any[]} dependents - An array of dependents for the condition function.
 */

export function usePopupCancel(roots: Preact.RefObject<any> | Preact.RefObject<any>[],
	onCancel: () => any, condition?: () => boolean, dependents?: any[]) {
	
	const body = document.getElementsByTagName('body')[0];

	useEffect(() => {
		const rootsArray = Array.isArray(roots) ? roots : [ roots ];
		if (condition && !condition()) return;

		const handlePointerCancel = (e: MouseEvent | TouchEvent) => {
			let x = e.target as HTMLElement;
			while (x) {
				for (const r of rootsArray) if (x === r.current) return;
				x = x.parentNode as HTMLElement;
			}
			onCancel();
		};

		const handleFocusCancel = (e: FocusEvent) => {
			let x = e.target as HTMLElement;
			while (x) {
				for (const r of rootsArray) if (x === r.current) return;
				x = x.parentNode as HTMLElement;
			}
			onCancel();
		};

		body.addEventListener('focusin', handleFocusCancel);
		body.addEventListener('mousedown', handlePointerCancel);
		body.addEventListener('touchstart', handlePointerCancel);

		return () => {
			body.removeEventListener('focusin', handleFocusCancel);
			body.removeEventListener('mousedown', handlePointerCancel);
			body.removeEventListener('touchstart', handlePointerCancel);
		};
	}, [ onCancel, condition, ...dependents || [] ]);
}

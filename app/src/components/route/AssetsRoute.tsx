import qs from 'query-string';
import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { Switch, Route, NavLink as Link, Redirect, useHistory, useLocation } from 'react-router-dom';

import AssetList from '../view/AssetList';
import NewAssetForm from '../view/NewAssetForm';
import AssetCollectionList from '../view/AssetCollectionList';

function testActive(match: any, desire: string) {
	return match.pathname.match(/\/a\/?$/g) && match.search === desire;
}

export default function AssetsRoute() {
	const history = useHistory();
	const location = useLocation();
	const [ { assets, collections, user } ] = useAppData([ 'assets', 'collections', 'user' ]);

	const view: 'assets' | 'collections' | string = qs.parse(location.search).view as any;

	return (
		<div class='AssetsRoute Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>Assets</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/a/?view=assets' isActive={(_, loc) => testActive(loc, '?view=assets')}>My Assets</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/a/?view=collections' isActive={(_, loc) => testActive(loc, '?view=collections')}>My Collections</Link>
			</aside>
			<main class='AssetsRoute-Main'>
				<Switch>
					<Route exact path='/a/new'><NewAssetForm/></Route>

					{view === 'assets' &&
						<Route>
							<AssetList assets={(assets || []).filter(a => a.user === user!.user)}
								onClick={(user, identifier) => history.push(`/u/${user}/a/${identifier}`)}
								onNew={() => history.push('/a/new')} />
						</Route>
					}

					{view === 'collections' &&
						<Route>
							<AssetCollectionList collections={collections || []}
								onClick={(user, identifier) => history.push(`/u/${user}/collection/${identifier}`)} />
						</Route>
					}
					
					<Redirect path='/a/' to='/a/?view=assets' />
				</Switch>
			</main>
		</div>
	);
}

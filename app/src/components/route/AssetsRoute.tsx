import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { Switch, Route, NavLink as Link, useHistory } from 'react-router-dom';

import AssetList from '../view/AssetList';
import NewAssetForm from '../view/NewAssetForm';
import AssetCollectionList from '../view/AssetCollectionList';

export default function AssetsRoute() {
	const history = useHistory();
	const [ { assets, collections, user } ] = useAppData([ 'assets', 'collections', 'user' ]);
	return (
		<div class='AssetsRoute Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>Assets</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active' exact to='/assets/'>My Assets</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to='/assets/collections/'>My Collections</Link>
			</aside>
			<main class='AssetsRoute-Main'>
				<Switch>
					<Route exact path='/assets/'>
						<AssetList assets={(assets || []).filter(a => a.user === user!.user)}
							onClick={(user, identifier) => history.push(`/asset/${user}/${identifier}`)}
							onNew={() => history.push('/assets/new')} />
					</Route>

					<Route exact path='/assets/collections'>
						<AssetCollectionList collections={collections || []}
							onClick={(user, identifier) => history.push(`/assets/collection/${user}/${identifier}`)} />
					</Route>

					<Route exact path='/assets/new'><NewAssetForm/></Route>
					{/* <Redirect to='/assets/uploaded' />*/}
				</Switch>
			</main>
		</div>
	);
}

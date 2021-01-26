import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { Switch, Route, Redirect, useParams } from 'react-router-dom';

import AssetList from '../view/AssetList';

export default function CampaignPage() {
	const [ { assets, collections } ] = useAppData([ 'assets', 'collections' ]);
	if (!collections || !assets) return null;

	const { collection: coll } = useParams<{ user: string; collection: string }>();
	const collection = (collections ?? []).filter(c => c.identifier === coll)[0];

	if (!collections) return <Redirect to='/a/' />;

	return (
		<div class='Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>{collection.name}</h2>

				{/* <Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}`} exact>Overview</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/players`}>Players</Link>
				{campaign.maps && <Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/maps`}>Maps</Link>}
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/assets`}>Assets</Link>*/}
			</aside>
			<main class='Page-Main'>
				<Switch>
					<Route exact path='/u/:user/a/:collection'>
						<AssetList assets={assets.filter(a => collection.items.includes(a.user + ':' + a.identifier))} />
					</Route>
					<Route path='/u/:user/a/:collection/:asset'>
						<h1>Asset!</h1>
					</Route>
				</Switch>
			</main>
		</div>
	);
}

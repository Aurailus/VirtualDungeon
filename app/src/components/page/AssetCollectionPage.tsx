import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { NavLink as Link, Switch, Route, Redirect, useParams } from 'react-router-dom';

import './AssetCollectionPage.sass';

import AssetList from '../view/AssetList';
import NewAssetForm from '../view/NewAssetForm';

export default function AssetCollectionPage() {
	const [ { assets, collections } ] = useAppData([ 'assets', 'collections' ]);
	if (!collections || !assets) return null;

	const { collection: coll } = useParams<{ user: string; collection: string }>();
	const collection = (collections ?? []).filter(c => c.identifier === coll)[0];

	if (!collections) return <Redirect to='/a/' />;

	return (
		<div class='Page AssetCollectionPage'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>Collections</h2>

				{collections.map(c =>
					<Link className='Page-SidebarCategory' activeClassName='Active'
						to={`/u/${c.user}/a/${c.identifier}`}>{c.name}</Link>)}

				{/* <Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}`} exact>Overview</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/players`}>Players</Link>
				{campaign.maps && <Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/maps`}>Maps</Link>}
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/assets`}>Assets</Link>*/}
			</aside>
			<main class='Page-Main'>
				<div class='AssetCollectionPage-Top'>
					<div class='AssetCollectionPage-TopBackgroundImage' style={{ backgroundImage: 'url(https://www.minecraft.net/content/dam/minecraft/java-snapshots/1-15-main-folder/19w40a/header.png)' }} />
					<div class='AssetCollectionPage-TopBackdropBlur' />
					<div class='AssetCollectionPage-HeaderWrap'>
						<div class='AssetCollectionPage-Header'>
							<h2>{collection.name}</h2>
							<p>{collection.identifier !== '_' ?
							collection.description :
							'This is a special collection containing all assets you\'ve uploaded to Virtual Dungeon. ' +
							'Deleting assets here will remove them from your account entirely, clearing them from any ' +
							'other collections they may be a part of.'}</p>
						</div>
					</div>
				</div>
				<div class='Page-Padding-Small'>
					<Switch>
						<Route exact path='/u/:user/a/:collection'>
							<AssetList assets={assets.filter(a => collection.items.includes(a.user + ':' + a.identifier))} />
						</Route>
						<Route path='/u/:user/a/:collection/:asset'>
							<NewAssetForm/>
						</Route>
					</Switch>
				</div>
			</main>
		</div>
	);
}

import * as Preact from 'preact';
import { useMemo } from 'preact/hooks';
import { useAppData } from '../../Hooks';
import { NavLink as Link, Switch, Route, Redirect, useParams, useHistory } from 'react-router-dom';

import './AssetCollectionPage.sass';

import AssetPage from './AssetPage';
import AssetList from '../view/AssetList';
import AssetUploader from '../view/AssetUploader';

import { Asset } from '../../../../common/DBStructs';

export default function AssetCollectionPage() {
	const history = useHistory();
	const [ { assets, collections } ] = useAppData([ 'assets', 'collections' ]);

	const { collection: coll } = useParams<{ user: string; collection: string }>();
	const collection = (collections ?? []).filter(c => c.identifier === coll)[0];

	const displayedAssets: Asset[] = useMemo(() => {
		if (!collections || !assets || !collection) return [];
		return assets.filter(a => collection.items.includes(a.user + ':' + a.identifier))
			.sort((a, b) => a.identifier < b.identifier ? -1 : 1);
	}, [ collections, collection, assets ]);

	if (!assets || !collections) return null;


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
					<div class='AssetCollectionPage-TopBackgroundImage' style={{ backgroundImage:
						'url(https://www.minecraft.net/content/dam/minecraft/java-snapshots/1-15-main-folder/19w40a/header.png)' }} />
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
							<AssetList assets={displayedAssets} onClick={(_, i) => history.push(i)} />
						</Route>
						<Route path='/u/:user/a/:collection/upload'>
							<AssetUploader/>
						</Route>
						<Route path='/u/:user/a/:collection/:asset' component={AssetPage} />
					</Switch>
				</div>
			</main>
		</div>
	);
}

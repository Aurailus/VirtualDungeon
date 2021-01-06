import * as Preact from 'preact';
import { useState } from 'preact/hooks';
import { useAppData } from '../../Hooks';
import { Redirect, useParams } from 'react-router-dom';

import AssetList from '../view/AssetList';

export default function CollectionRoute() {
	const [ { collections, assets },, mergeData ] = useAppData([ 'collections', 'assets' ]);
	if (!collections) return null;

	const [ adding, setAdding ] = useState<boolean>(false);

	const { id } = useParams<{ id: string }>();
	const currentCollection = (collections ?? []).filter(c => c.identifier === id)[0];
	if (!currentCollection) return <Redirect to='/assets/collections/' />;

	const collectionAssets = (assets || []).filter(({ user, identifier }) => currentCollection.items.includes(user + ':' + identifier));

	const handleAddingAsset = () => {
		setAdding(true);
	};

	const handleAddAsset = async (user: string, identifier: string) => {
		const res = await fetch('/data/collection/add', {
			method: 'POST', cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ collection: currentCollection.identifier, asset: user + ':' + identifier })
		});

		if (res.status !== 200) console.error(await res.text());
		else {
			const data = await res.json();
			await mergeData(data);
		}

		setAdding(false);
	};

	return (
		<div class='CollectionRoute Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>{currentCollection.name}</h2>

				{/* <Link className='Page-SidebarCategory' activeClassName='Active' exact to={`/campaign/${id}`}>Overview</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/campaign/${id}/players`}>Players</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/campaign/${id}/maps`}>Maps</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/campaign/${id}/assets`}>Assets</Link>*/}
			</aside>
			<main class='CollectionRoute-Main'>
				{!adding && <AssetList assets={collectionAssets} onClick={() => {/**/}} onNew={handleAddingAsset} newText='Add Asset' />}
				{adding && <Preact.Fragment>
					<h3>Add Asset</h3>
					<AssetList assets={assets || []} onClick={handleAddAsset} />
				</Preact.Fragment>}
			</main>
		</div>
	);
}

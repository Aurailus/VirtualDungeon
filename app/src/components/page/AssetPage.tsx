import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { Redirect, useParams, useHistory } from 'react-router-dom';

import Button from '../Button';

export default function AssetRoute() {
	const [ { assets } ] = useAppData('assets');
	if (!assets) return null;

	const history = useHistory();
	const { asset } = useParams<{ asset: string }>();
	const currentAsset = (assets ?? []).filter(a => a.identifier === asset)[0];

	if (!currentAsset) return <Redirect to='/assets/' />;

	const handleDeleteAsset = () => {
		fetch('/data/asset/delete', {
			method: 'POST', cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ identifier: asset })
		});
		
		history.push('../');
	};

	return (
		<div class='AssetRoute Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>{currentAsset.name}</h2>
			</aside>
			<main class='AssetRoute-Main'>
				<img src={'/app/asset/' + currentAsset.path} role='presentational' alt=''/>
				<Button onClick={handleDeleteAsset} label='Delete'/>
			</main>
		</div>
	);
}

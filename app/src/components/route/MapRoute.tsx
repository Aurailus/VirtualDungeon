import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { NavLink as Link, Redirect, useParams } from 'react-router-dom';

export default function MapRoute() {
	const [ { campaigns } ] = useAppData();
	const { campaign: campIdentifier, map: mapIdentifier } = useParams<{ campaign: string; map: string }>();

	const campaign = (campaigns ?? []).filter(c => c.identifier === campIdentifier)[0];
	if (!campaign) return <Redirect to='/' />;
	const map = campaign.maps.filter(c => c.identifier === mapIdentifier)[0];
	if (!map) return <Redirect to={`/${campIdentifier}`} />;

	return (
		<div class='MapRoute'>
			<Link to={`/${campaign}`}>Up</Link>
			<Link to='/'>Home</Link>
			<h1>Campaign/Map: {campaign}/{map}</h1>
			<Link to={`/${campIdentifier}/${mapIdentifier}/edit`}>Edit</Link>
		</div>
	);
}

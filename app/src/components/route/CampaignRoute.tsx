import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { Switch, Route, Redirect, NavLink as Link, useParams } from 'react-router-dom';

import MapList from '../view/MapList';
import NewMapForm from '../view/NewMapForm';
import PlayerList from '../view/PlayerList';
import CampaignOverview from '../view/CampaignOverview';

export default function CampaignRoute() {
	const [ { campaigns } ] = useAppData('campaigns');
	if (!campaigns) return null;

	const { id } = useParams<{ id: string }>();
	const currentCampaign = (campaigns ?? []).filter(c => c.identifier === id)[0];

	if (!currentCampaign) return <Redirect to='/campaigns/' />;

	return (
		<div class='CampaignRoute Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>{currentCampaign.title}</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active' exact to={`/campaign/${id}`}>Overview</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/campaign/${id}/players`}>Players</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/campaign/${id}/maps`}>Maps</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/campaign/${id}/assets`}>Assets</Link>
			</aside>
			<main class='CampaignRoute-Main'>
				<Switch>
					<Route exact path='/campaign/:id'><CampaignOverview campaign={currentCampaign} /></Route>
					<Route exact path='/campaign/:id/players'>
						<PlayerList players={[
							{ name: 'Player', sprite: '/app/static/token/baby_blue_dragon.png' },
							{ name: 'Player', sprite: '/app/static/token/cadin_1.png' },
							{ name: 'Player', sprite: '/app/static/token/dragonfolk_1.png' },
							{ name: 'Player', sprite: '/app/static/token/druid_male.png' },
							{ name: 'Player', sprite: '/app/static/token/naexi_human_yklwa.png' }
						]}/>
					</Route>
					<Route exact path='/campaign/:id/maps'><MapList maps={currentCampaign.maps} /></Route>
					<Route exact path='/campaign/:id/maps/new'><NewMapForm /></Route>
					<Route exact path='/campaign/:id/assets'></Route>

					<Redirect to={`/campaign/${id}`} />
				</Switch>
			</main>
		</div>
	);
}

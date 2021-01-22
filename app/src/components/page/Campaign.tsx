import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { Switch, Route, Redirect, NavLink as Link, useParams } from 'react-router-dom';

import Button from '../Button';

import MapList from '../view/MapList';
import NewMapForm from '../view/NewMapForm';
import PlayerList from '../view/PlayerList';
import CampaignOverview from '../view/CampaignOverview';

export default function CampaignPage() {
	const [ { campaigns } ] = useAppData('campaigns');
	if (!campaigns) return null;

	const { user, campaign: camp } = useParams<{ user: string; campaign: string }>();
	const campaign = (campaigns ?? []).filter(c => c.identifier === camp)[0];

	if (!campaign) return <Redirect to='/campaigns/' />;

	return (
		<div class='CampaignPage Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>{campaign.title}</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}`} exact>Overview</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/players`}>Players</Link>
				{campaign.maps && <Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/maps`}>Maps</Link>}
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/u/${user}/c/${camp}/assets`}>Assets</Link>
			</aside>
			<Switch>
				<Route exact path='/u/:user/c/:campaign'>
					<main>
						<CampaignOverview campaign={campaign} actions={[
							// <Button to='details' icon='edit' alt='Edit' />
							campaign.maps && <Button to='play' icon='play' label='Play' disabled={campaign.maps.length === 0} />
						]}
						/>
					</main>
				</Route>
				<Route>
					<main class='Page-Main'>
						<Switch>
							<Route exact path='/u/:user/c/:campaign/players'>
								<PlayerList players={campaign.players} campaign={camp} user={campaign.user} /></Route>

							{campaign.maps && <Route exact path='/u/:user/c/:campaign/maps/'><MapList maps={campaign.maps} /></Route>}
							<Route exact path='/u/:user/c/:campaign/maps/new'><NewMapForm /></Route>
							<Route exact path='/u/:user/c/:campaign/assets/'></Route>

							<Redirect to={`/u/${user}/c/${campaign}`} />
						</Switch>
					</main>
				</Route>
			</Switch>
		</div>
	);
}

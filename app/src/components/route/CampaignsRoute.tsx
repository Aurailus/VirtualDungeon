import * as Preact from 'preact';
import { NavLink as Link, Switch, Route, Redirect } from 'react-router-dom';

import './CampaignsRoute.sass';

import CampaignList from '../view/CampaignList';
import NewCampaignForm from '../view/NewCampaignForm';

function testActive(match: any, desire: string) {
	return match.pathname.match(/\/campaigns\/?$/g) && match.search === desire;
}

export default function CampaignsRoute() {
	return (
		<div class='CampaignsRoute Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>Campaigns</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/campaigns' isActive={(_, loc) => testActive(loc, '')}>All Campaigns</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/campaigns?owner=self' isActive={(_, loc) => testActive(loc, '?owner=self')}>My Campaigns</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/campaigns?owner=other' isActive={(_, loc) => testActive(loc, '?owner=other')}>Joined Campaigns</Link>
			</aside>

			<Switch>
				<Route path='/campaigns/new'>
					<main class='CampaignsRoute-New'>
						<div class='CampaignsRoute-NewCard'>
							<NewCampaignForm />
						</div>
					</main>
				</Route>

				<Route exact path='/campaigns'>
					<main class='CampaignsRoute-Main Page-Main'>
						<CampaignList />
					</main>
				</Route>

				<Redirect to='/campaigns' />
			</Switch>
		</div>
	);
}

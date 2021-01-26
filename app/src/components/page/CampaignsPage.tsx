import qs from 'query-string';
import * as Preact from 'preact';
import { NavLink as Link, useLocation } from 'react-router-dom';

import CampaignList from '../view/CampaignList';

function testActive(match: any, desire: string) {
	return match.pathname.match(/\/c\/?$/g) && match.search === desire;
}

export default function CampaignsPage() {
	const location = useLocation();

	return (
		<div class='Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>Campaigns</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/c/' isActive={(_, loc) => testActive(loc, '')}>All Campaigns</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/c/?role=owner' isActive={(_, loc) => testActive(loc, '?role=owner')}>My Campaigns</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/c/?role=player' isActive={(_, loc) => testActive(loc, '?role=player')}>Joined Campaigns</Link>
			</aside>

			<main class='Page-Main'>
				<CampaignList filter={qs.parse(location.search).role as any || 'all'}/>
			</main>
		</div>
	);
}

import * as Preact from 'preact';
import { NavLink as Link } from 'react-router-dom';

import NewCampaignForm from '../view/NewCampaignForm';

function testActive(match: any, desire: string) {
	return match.pathname.match(/\/c\/?$/g) && match.search === desire;
}

export default function NewCampaignPage() {
	return (
		<div class='Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>Campaigns</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/c/' isActive={(_, loc) => testActive(loc, '')}>All Campaigns</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/c/?owner=self' isActive={(_, loc) => testActive(loc, '?owner=self')}>My Campaigns</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/c/?owner=other' isActive={(_, loc) => testActive(loc, '?owner=other')}>Joined Campaigns</Link>
			</aside>

			<main class='Page-Main'>
				<div class='Page-Card'>
					<NewCampaignForm />
				</div>
			</main>
		</div>
	);
}

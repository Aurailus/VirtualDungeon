import qs from 'query-string';
import * as Preact from 'preact';
import { NavLink as Link, useLocation } from 'react-router-dom';

import AssetCollectionList from '../view/AssetCollectionList';

function testActive(match: any, desire: string) {
	return match.pathname.match(/\/a\/?$/g) && match.search === desire;
}

export default function AssetCollectionsPage() {
	const location = useLocation();

	return (
		<div class='Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>Collections</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/a/' isActive={(_, loc) => testActive(loc, '')}>All Collections</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/a/?role=owner' isActive={(_, loc) => testActive(loc, '?role=owner')}>My Collections</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active'
					to='/a/?role=subscriber' isActive={(_, loc) => testActive(loc, '?role=subscriber')}>Subscribed Collections</Link>
			</aside>

			<main class='Page-Main'>
				<AssetCollectionList filter={qs.parse(location.search).role as any || 'all'}/>
			</main>
		</div>
	);
}

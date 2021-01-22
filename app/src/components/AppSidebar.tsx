import * as Preact from 'preact';
import { NavLink as Link } from 'react-router-dom';

import './AppSidebar.sass';

export default function AppHeader() {
	return (
		<div class='AppSidebar'>
			<nav>
				<Link className='AppSidebar-Link' to='/'><img role='heading' aria-level='1' aria-label='Virtual Dungeon'
					src='/app/static/logo_small.png' alt='Virtual Dungeon' /></Link>

				<hr class='AppSidebar-Rule' />

				<Link className='AppSidebar-Link Pixel' activeClassName='Active' exact to='/'>
					<img src='/app/static/icon/home.png' alt='Home' /></Link>

				<Link className='AppSidebar-Link Pixel' activeClassName='Active' to='/c'>
					<img src='/app/static/icon/campaign.png' alt='Campaigns' /></Link>

				<Link className='AppSidebar-Link Pixel' activeClassName='Active' to='/a'>
					<img src='/app/static/icon/assets.png' alt='Assets' /></Link>
			</nav>

			<Link className='AppSidebar-Link Pixel' activeClassName='Active' to='/settings'>
				<img src='/app/static/icon/settings_large.png' alt='Settings' /></Link>
		</div>
	);
}

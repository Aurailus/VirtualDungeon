import * as Preact from 'preact';
import { NavLink as Link } from 'react-router-dom';

import './AppHeader.sass';

export default function AppHeader() {
	return (
		<div class='AppHeader'>
			<h1><Link to='/'>Virtual Dungeon</Link></h1>
			<div class='AppHeader-Buttons'>
				<button><img src='/app/static/ui/icon/settings.png' alt='Settings'/></button>
				<button><img src='/app/static/ui/icon/profile.png' alt='Profile'/></button>
				<button><img src='/app/static/ui/icon/logout.png' alt='Logout'/></button>
			</div>
		</div>
	);
}

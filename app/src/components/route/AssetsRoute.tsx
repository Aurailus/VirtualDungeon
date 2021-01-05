import * as Preact from 'preact';
import { Switch, Route, Redirect, NavLink as Link } from 'react-router-dom';

import NewAssetForm from '../view/NewAssetForm';
import MyAssetsList from '../view/MyAssetsList';

export default function AssetsRoute() {
	return (
		<div class='AssetsRoute Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>Assets</h2>

				{/* <Link className='Page-SidebarCategory' activeClassName='Active' exact to='/assets/'>Featured Assets</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' exact to='/assets/subscribed'>Subscribed Assets</Link>*/}
				<Link className='Page-SidebarCategory' activeClassName='Active' to='/assets/uploaded'>Uploaded Assets</Link>
			</aside>
			<main class='AssetsRoute-Main'>
				<Switch>
					{/* <Route exact path='/assets/'>
						<h1>Storefront</h1>
					</Route>
					<Route exact path='/assets/subscribed'>
						<h1>Subscribed</h1>
					</Route>*/}
					<Route exact path='/assets/uploaded'><MyAssetsList/></Route>
					<Route exact path='/assets/new'><NewAssetForm/></Route>
					<Redirect to='/assets/uploaded' />
				</Switch>
			</main>
		</div>
	);
}

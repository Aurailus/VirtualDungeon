import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.sass';

import * as Page from './page/Pages';
import AppSidebar from './AppSidebar';

import { AppData } from '../../../common/AppData';
import { AppDataContext, updateAppData } from './AppDataContext';

type AppState = 'QUERYING' | 'LOGIN' | 'AUTH';

/**
 * The main entry point for the Preact app.
 * Handles routing and data.
 */

export default function App() {
	const [ data, setData ] = useState<Partial<AppData>>({});
	const [ state, setState ] = useState<AppState>(() => Cookie.get('tkn') ? 'QUERYING' : 'LOGIN');

	const mergeData = useCallback((data: Partial<AppData>) => {
		setData((prevData: Partial<AppData>) => { return { ...prevData, ...data }; });
	}, []);

	useEffect(() => {
		if (state === 'QUERYING') updateAppData(mergeData, ['user']).then(() => setState('AUTH'));
	}, [ state ]);

	return (
		<AppDataContext.Provider value={{ data: data, mergeData: mergeData }}>
			{state === 'LOGIN' &&
				<div class='App'>
					<div/>
					<div class='App-Main'>
						<Page.Login onLogin={() => setState('AUTH')} />
					</div>
				</div>
			}
			{state === 'AUTH' &&
				<div class='App'>
					<Router basename='/app'>
						{/* Enforce trailing slashes in all URLs to make relative links work properly. */}
						<Route path="/:url*" exact strict render={props => <Redirect to={`${props.location.pathname}/${props.location.search}`} />} />
						
						<Switch>
							<Route path='/u/:user/c/:campaign/play' component={Page.Editor} />
							<Route>
								<div class='App-Main'>
									<AppSidebar />
									<Switch>
										<Route path='/c/new/' component={Page.NewCampaign} />
										<Route path='/c/join/:token/' component={Page.JoinCampaign} />
										<Route exact path='/c/' component={Page.Campaigns} />
										<Redirect path='/c/' to='/c/' />

										<Route exact path='/a/' component={Page.AssetCollections} />
										<Redirect path='/a/' to='/a/' />

										<Route path='/u/:user/c/:campaign/' component={Page.Campaign} />
										<Route path='/u/:user/a/:collection' component={Page.AssetCollection} />
										
										<Redirect to='/c/' />
									</Switch>
								</div>
							</Route>
						</Switch>
					</Router>
				</div>
			}
		</AppDataContext.Provider>
	);
}

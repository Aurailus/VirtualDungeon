import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.sass';

import AppSidebar from './AppSidebar';
import * as Routes from './route/Routes';

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
						<Routes.Login onLogin={() => setState('AUTH')} />
					</div>
				</div>
			}
			{state === 'AUTH' &&
				<div class='App'>
					<Router basename='/app'>
						<Switch>
							<Route path='/edit/:campaign/:map' component={Routes.Editor} />
							<Route>
								<div class='App-Main'>
									<AppSidebar />
									<Switch>
										<Route path='/assets' component={Routes.Assets} />
										
										<Route path='/campaigns' component={Routes.Campaigns} />
										<Route path='/campaign/:id?' component={Routes.Campaign} />
										
										<Redirect to='/campaigns' />
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

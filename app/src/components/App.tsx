import Cookie from 'js-cookie';
import * as Preact from 'preact';
import { useState, useEffect, useCallback } from 'preact/hooks';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import './App.sass';

import AppHeader from './AppHeader';
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
					<div class='App-Main'>
						<Router basename='/app'>
							<AppHeader />
							<Switch>
								<Route exact path='/:campaign/' component={Routes.Home as any} />
								<Route exact path='/:campaign/details' component={Routes.Campaign as any} />
								<Route exact path='/:campaign/:map' component={Routes.Map as any} />

								<Route exact path='/:campaign/:map/edit' component={Routes.Editor as any} />
								{/* <Route exact path='/:campaign/play' component={Route.Play as any} />*/}
								
								<Route exact path='/' component={Routes.Home as any} />
								<Redirect to='/' />
							</Switch>
						</Router>
					</div>
				</div>
			}
		</AppDataContext.Provider>
	);
}

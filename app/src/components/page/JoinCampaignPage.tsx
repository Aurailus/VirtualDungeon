import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { useState, useEffect } from 'preact/hooks';
import { Switch, Route, Redirect, NavLink as Link, useParams, useHistory } from 'react-router-dom';

import './JoinCampaignPage.sass';

import Button from '../Button';

import PlayerList from '../view/PlayerList';
import CampaignOverview from '../view/CampaignOverview';

import { Campaign } from '../../../../common/DBStructs';

export default function CampaignPage() {
	const history = useHistory();
	const [ { campaigns },, mergeData ] = useAppData('campaigns');
	const { token } = useParams<{ token: string }>();
	const [ campaign, setCampaign ] = useState<Partial<Campaign> | undefined | null>(undefined);
	
	useEffect(() => (fetch('/data/campaign/invite/' + token, { cache: 'no-cache' })
		.then(r => r.json()).then(setCampaign).catch(() => setCampaign(null)), undefined), []);

	if (campaign === undefined) return null;
	if (campaign === null) return (
		<div class='JoinCampaignPage Page'>
			<aside class='Page-Sidebar' />
			<main class='JoinCampaignPage-NotFound'>
				<h2 class='JoinCampaignPage-NotFoundHeader'>Sorry, we couldn't find your campaign.</h2>
				<p class='JoinCampaignPage-NotFoundBody'>Try asking your game master for another invite link.</p>
			</main>
		</div>
	);

	if ((campaigns || []).filter(c => c.identifier === campaign.identifier || c.user === campaign.user).length) {
		history.replace(`/u/${campaign.user}/c/${campaign.identifier}`);
		return null;
	}

	const handleJoinCampaign = async () => {
		const r = await fetch('/data/invite/accept', {
			method: 'POST', cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ token })
		});

		const data = await r.json();
		mergeData(data);

		history.push(`/u/${campaign.user}/c/${campaign.identifier}`);
	};

	return (
		<div class='JoinCampaignPage Page'>
			<aside class='Page-Sidebar'>
				<h2 class='Page-SidebarTitle'>{campaign.title}</h2>

				<Link className='Page-SidebarCategory' activeClassName='Active' exact to={`/c/join/${token}/`}>Overview</Link>
				<Link className='Page-SidebarCategory' activeClassName='Active' to={`/c/join/${token}/players`}>Players</Link>
			</aside>
			<main>
				<Switch>
					<Route exact path='/c/join/:token'><CampaignOverview campaign={campaign} actions={
						<Button icon='add' label='Join Campaign' onClick={handleJoinCampaign} />
					}/></Route>
					<Route exact path='/c/join/:token/players'><PlayerList players={campaign.players ?? []}/></Route>

					<Redirect to={`/c/join/${token}/`} />
				</Switch>
			</main>
		</div>
	);
}

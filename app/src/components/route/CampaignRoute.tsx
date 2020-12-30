import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { Redirect, useParams } from 'react-router-dom';

import './CampaignRoute.sass';

import CampaignDetails from '../card/CampaignDetails';

export default function CampaignRoute() {
	const [ { campaigns } ] = useAppData('campaigns');
	if (!campaigns) return null;

	const { campaign: identifier } = useParams<{ campaign: string }>();
	const currentCampaign = (campaigns ?? []).filter(c => c.identifier === identifier)[0];

	if (!currentCampaign) return <Redirect to='/' />;
	
	return (
		<div class='CampaignRoute'>
			<div class='CampaignRoute-Card'>
				<CampaignDetails campaign={currentCampaign} />
			</div>
		</div>
	);
}

import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { useParams } from 'react-router-dom';

import './HomeRoute.sass';

import CampaignList from '../card/CampaignList';
import NewCampaignForm from '../card/NewCampaignForm';
import CampaignOverview from '../card/CampaignOverview';

export default function HomeRoute() {
	const [ { campaigns } ] = useAppData('campaigns');

	const { campaign: identifier } = useParams<{ campaign: string }>();
	const currentCampaign = (campaigns ?? []).filter(c => c.identifier === identifier)[0];

	return (
		<div class='HomeRoute'>
			<div class='HomeRoute-Card'>
				<CampaignList allowNew={identifier !== 'new'} />
			</div>

			{(currentCampaign || identifier === 'new') && <div class='HomeRoute-Card'>
				{identifier === 'new' && <NewCampaignForm />}
				{currentCampaign && <CampaignOverview campaign={currentCampaign} />}
			</div>}
		</div>
	);
}

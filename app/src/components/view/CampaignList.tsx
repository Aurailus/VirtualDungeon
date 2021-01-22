import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { NavLink as Link } from 'react-router-dom';

import './CampaignList.sass';

import { UserCampaign } from '../../../../common/DBStructs';

function CampaignItem({ campaign }: { campaign: UserCampaign }) {
	return (
		<li class='CampaignList-CampaignWrap'>
			<Link className='CampaignList-Campaign' to={`/u/${campaign.user}/c/${campaign.identifier}`}>
				<div class='CampaignList-CampaignInner'>
					<div class='CampaignList-CampaignPreview'>
						<img src='https://placekitten.com/400/300' alt='' />
					</div>
					<div class='CampaignList-CampaignDetails'>
						<p class='CampaignList-CampaignTitle'>{campaign.title || 'Untitled Campaign'}</p>
						<div class='CampaignList-CampaignOwner'>
							<img src='/app/static/icon/profile.png' alt='' />
							<span>{campaign.user}</span>
						</div>
					</div>
				</div>
			</Link>
		</li>
	);
};

interface Props {
	filter: 'all' | 'owner' | 'player';
}

export default function CampaignList({ filter }: Props) {
	const [ { user, campaigns } ] = useAppData([ 'campaigns', 'user' ]);

	if (!campaigns) return (
		<div class='CampaignList'>
			<p>Loading Campaigns...</p>
		</div>
	);

	// This equivalency thing is wack! Draw up a truth table or something, you'll figure it out.
	const filtered = filter === 'all' ? campaigns : campaigns.filter(c => (filter === 'owner') === (c.user === user?.user));

	return (
		<div class='CampaignList'>
			<ul class='CampaignList-Grid'>
				{filtered.map(campaign => <CampaignItem campaign={campaign}/>)}
				{filter !== 'player' && <li class='CampaignList-CampaignWrap'>
					<Link to='/c/new' className='CampaignList-NewCampaign'>
						<img src='/app/static/icon/campaign_new.png' alt=''/>
						<p>Create Campaign</p>
					</Link>
				</li>}
			</ul>
		</div>
	);
}

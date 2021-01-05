import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { NavLink as Link } from 'react-router-dom';

import './CampaignList.sass';

export default function CampaignList() {
	const [ { campaigns } ] = useAppData('campaigns');

	return (
		<div class='CampaignList'>
			{campaigns === undefined && <p>Loading Campaigns...</p>}
			{campaigns !== undefined &&
				<Preact.Fragment>
					<ul class='CampaignList-Grid'>
						{campaigns.map(c => <li class='CampaignList-CampaignWrap'>
							<Link className='CampaignList-Campaign' to={`/campaign/${c.identifier}`}>
								<div class='CampaignList-CampaignInner'>
									<div class='CampaignList-CampaignPreview'>
										<img src='https://placekitten.com/400/300' alt='' />
									</div>
									<p class='CampaignList-CampaignTitle'>{c.title || 'Untitled'}</p>
								</div>
							</Link>
						</li>)}
						<li class='CampaignList-CampaignWrap'>
							<Link className='CampaignList-NewCampaign' to='/campaigns/new'>
								<img src='/app/static/ui/icon/campaign_new.png' alt=''/>
								<p>Create Campaign</p>
							</Link>
						</li>
					</ul>
				</Preact.Fragment>
			}
		</div>
	);
}

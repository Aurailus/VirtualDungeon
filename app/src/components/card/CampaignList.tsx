import * as Preact from 'preact';
import { useState } from 'preact/hooks';
import { useAppData } from '../../Hooks';
import { NavLink as Link } from 'react-router-dom';

import './CampaignList.sass';

import Button from '../Button';
import ButtonGroup from '../ButtonGroup';

interface Props {
	allowNew?: boolean;
}

export default function CampaignsCard({ allowNew }: Props) {
	const [ { campaigns } ] = useAppData('campaigns');

	const [ page, setPage ] = useState<number>(0);

	const currentCampaigns = (campaigns || []).slice(page * 4, (page + 1) * 4);

	return (
		<div class='CampaignList'>
			<h2>Campaigns</h2>

			{campaigns === undefined && <p>Loading Campaigns...</p>}
			{campaigns !== undefined &&
				<Preact.Fragment>
					<ul class='CampaignList-Grid'>
						{currentCampaigns.map(c => <li class='CampaignList-CampaignWrap'>
							<Link className='CampaignList-Campaign' to={`/${c.identifier}`}>
								<div class='CampaignList-CampaignInner'>
									<img class='CampaignList-CampaignPreview' src='https://placekitten.com/400/300' alt='' />
									<p class='CampaignList-CampaignTitle'>{c.title || 'Untitled'}</p>
								</div>
							</Link>
						</li>)}
					</ul>
					<div class='CampaignList-Actions'>
						<Button icon='add' alt='New Campaign' to='/new' disabled={!allowNew} />
						
						{(campaigns || []).length > 4 &&
							<ButtonGroup class='HomeView-Pagination'>
								<Button icon='nav_left' alt='Next Page'
									onClick={() => setPage(page - 1)} disabled={page === 0}/>
								
								{(() => {
									let elems: Preact.VNode[] = [];
									for (let i = 0; i < campaigns.length / 4; i++) elems.push(
										<Button label={(i + 1).toString()} onClick={() => setPage(i)} disabled={page === i} />);
									return elems;
								})()}
								
								<Button icon='nav_right' alt='Next Page'
									onClick={() => setPage(page + 1)} disabled={page + 1 >= campaigns.length / 4} />
							</ButtonGroup>
						}
					</div>
				</Preact.Fragment>
			}
		</div>
	);
}

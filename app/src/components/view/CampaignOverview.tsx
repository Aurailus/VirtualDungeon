import * as Preact from 'preact';
import { Link } from 'react-router-dom';

import './CampaignOverview.sass';

import Button from '../Button';
import ButtonGroup from '../ButtonGroup';

import { Campaign } from '../../../../common/DBStructs';

interface Props {
	campaign: Campaign;
}

export default function CampaignOverview({ campaign }: Props) {
	return (
		<div class='CampaignOverview'>
			<div class='CampaignOverview-Carousel'>
				<div class='CampaignOverview-CarouselInner'>
					<img class='CampaignOverview-CarouselImage Unfocused' src='https://placekitten.com/100/300' alt='' />
					<img class='CampaignOverview-CarouselImage' src='https://placekitten.com/800/300' alt='' />
					<img class='CampaignOverview-CarouselImage Unfocused' src='https://placekitten.com/100/300' alt='' />
				</div>
			</div>

			<div class='CampaignOverview-Details'>
				<div class='CampaignOverview-Actions'>
					<ButtonGroup>
						<Button to={`${campaign.identifier}/details`} icon='edit' alt='Edit'/>
						<Button to={`${campaign.identifier}/play`} icon='play' label='Start' disabled={campaign.maps.length === 0}/>
					</ButtonGroup>
				</div>

				<h3 class='CampaignOverview-Title'>{campaign.title || 'Untitled'}</h3>
				<p class='CampaignOverview-Description'>{campaign.description || 'Lorem ipsum dolor sit amet...'}</p>
				
				<Link to={`${campaign.identifier}/players`}>
					<div class='CampaignOverview-CharactersWrap'>
						<div class='CampaignOverview-Characters'>
							<div class='CampaignOverview-Character' style={{ backgroundImage: 'url(/app/static/token/baby_blue_dragon.png)' }} />
							<div class='CampaignOverview-Character' style={{ backgroundImage: 'url(/app/static/token/cadin_1.png)' }} />
							<div class='CampaignOverview-Character' style={{ backgroundImage: 'url(/app/static/token/dragonfolk_1.png)' }} />
							<div class='CampaignOverview-Character' style={{ backgroundImage: 'url(/app/static/token/druid_male.png)' }} />
							<div class='CampaignOverview-Character' style={{ backgroundImage: 'url(/app/static/token/naexi_human_yklwa.png)' }} />
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}

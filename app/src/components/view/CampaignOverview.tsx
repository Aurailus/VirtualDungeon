import * as Preact from 'preact';
import { Link } from 'react-router-dom';

import './CampaignOverview.sass';

import ButtonGroup from '../ButtonGroup';

import { Campaign } from '../../../../common/DBStructs';

interface Props {
	campaign: Partial<Campaign>;
	actions?: Preact.ComponentChildren;
}

export default function CampaignOverview({ campaign, actions }: Props) {
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
				{actions && <div class='CampaignOverview-Actions'><ButtonGroup>{actions}</ButtonGroup></div>}

				<h3 class='CampaignOverview-Title'>{campaign.title || 'Untitled'}</h3>
				<p class='CampaignOverview-Description'>{campaign.description || 'Lorem ipsum dolor sit amet...'}</p>
				
				<Link to='players'>
					<div class='CampaignOverview-CharactersWrap'>
						<div class='CampaignOverview-Characters'>
							<div class='CampaignOverview-Character' style={
								{ backgroundImage: 'url(/app/static/stock/token/baby_blue_dragon.png)' }} />
							<div class='CampaignOverview-Character' style={
								{ backgroundImage: 'url(/app/static/stock/token/cadin_1.png)' }} />
							<div class='CampaignOverview-Character' style={
								{ backgroundImage: 'url(/app/static/stock/token/dragonfolk_1.png)' }} />
							<div class='CampaignOverview-Character' style={
								{ backgroundImage: 'url(/app/static/stock/token/druid_male.png)' }} />
							<div class='CampaignOverview-Character' style={
								{ backgroundImage: 'url(/app/static/stock/token/naexi_human_yklwa.png)' }} />
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}

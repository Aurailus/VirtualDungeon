import * as Preact from 'preact';

import './CampaignDetails.sass';

// import Button from '../Button';
// import ButtonGroup from '../ButtonGroup';

import MapList from './MapList';

import { Campaign } from '../../../../common/DBStructs';

interface Props {
	campaign: Campaign;
}

export default function CampaignDetails({ campaign }: Props) {
	return (
		<div class='CampaignDetails'>
			<div class='CampaignDetails-Split'>
				<div class='CampaignDetails-ImageWrap'>
					<div class='CampaignDetails-Image'>
						<img src='https://placekitten.com/400/300' alt='' />
					</div>
				</div>
				<div class='CampaignDetails-Right'>
					<div class='CampaignDetails-Details'>
						{/* <div class='CampaignDetails-Actions'>
							<ButtonGroup>
								<Button to={`${campaign.identifier}/details`} icon='edit' alt='Edit'/>
								<Button to={`${campaign.identifier}/play`} icon='play' label='Start' disabled={campaign.maps.length === 0}/>
							</ButtonGroup>
						</div>*/}

						<h2 class='CampaignDetails-Title'>{campaign.title || 'Untitled'}</h2>
						<p class='CampaignDetails-Description'>{campaign.description || 'Lorem ipsum dolor sit amet...'}</p>
					</div>
				</div>
			</div>

			<MapList maps={campaign.maps} allowNew={true}/>
		</div>
	);
}

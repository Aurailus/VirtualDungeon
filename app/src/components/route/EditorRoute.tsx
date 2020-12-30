import * as Preact from 'preact';
// import { useParams, NavLink as Link } from 'react-router-dom';

import './EditorRoute.sass';

import Editor from '../Editor';

export default function CampaignView() {
	// const { campaign, map } = useParams<{ campaign: string; map: string }>();

	return (
		<div class='EditorRoute'>
			<Editor />
		</div>
	);
}

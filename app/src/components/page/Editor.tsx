import qs from 'query-string';
import * as Preact from 'preact';
import { useParams, useLocation } from 'react-router-dom';

import Editor from '../Editor';

import './Editor.sass';

export default function EditorPage() {
	const { user, campaign } = useParams<{ user: string; campaign: string }>();
	const map = qs.parse(useLocation().search).map as string | undefined;
	return (
		<div class='EditorPage'>
			<Editor user={user} identifier={campaign} mapIdentifier={map} />
		</div>
	);
}

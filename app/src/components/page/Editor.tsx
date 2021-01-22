import * as Preact from 'preact';
import { useParams } from 'react-router-dom';

import Editor from '../Editor';

import './Editor.sass';

export default function EditorPage() {
	const { user, campaign } = useParams<{ user: string; campaign: string }>();

	return (
		<div class='EditorPage'>
			<Editor user={user} identifier={campaign} />
		</div>
	);
}

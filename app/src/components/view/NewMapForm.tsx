import * as Preact from 'preact';
import { useState } from 'preact/hooks';
import { useAppData } from '../../Hooks';
import { useParams, useHistory } from 'react-router-dom';

import './NewMapForm.sass';

import { Label, Text } from '../input/Input';

import Button from '../Button';

export default function NewMapForm() {
	const history = useHistory();
	const [ ,, mergeData ] = useAppData();
	const { campaign } = useParams<{ campaign: string }>();

	const [ queryState, setQueryState ] = useState<'idle' | 'querying'>('idle');
	
	const [ name, setName ] = useState<string>('');
	const [ description, setDescription ] = useState<string>('');

	const createMap = async () => {
		if (queryState !== 'idle') return;
		setQueryState('querying');

		const res = await fetch('/data/map/new', {
			method: 'POST', cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ campaign, name, description })
		});
		
		setQueryState('idle');

		if (res.status !== 200) console.error(await res.text());
		else {
			const data = await res.json();
			await mergeData(data);
			history.push(`/campaign/${campaign}/maps`);
		}
	};

	return (
		<div class='NewMapForm'>
			<div class='NewMapForm-Card'>
				<h2 class='NewMapForm-Title'>New Map</h2>

				<Label label='Map Title'>
					<Text value={name} setValue={setName} />
				</Label>

				<Label label='Map Description'>
					<Text class='NewMapForm-Description' long={true} value={description} setValue={setDescription} />
				</Label>

				<Button class='NewMapForm-Submit' onClick={createMap} icon='add' label='Create' disabled={!name} />
			</div>
		</div>
	);
}

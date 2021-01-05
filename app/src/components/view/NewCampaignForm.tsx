import * as Preact from 'preact';
import { useState } from 'preact/hooks';
import { useAppData } from '../../Hooks';
import { useHistory } from 'react-router-dom';

import './NewCampaignForm.sass';

import { Label, Text } from '../input/Input';

import Button from '../Button';

import * as Format from '../../../../common/Format';

export default function NewCampaignForm() {
	const [ ,, mergeData ] = useAppData();
	const history = useHistory();

	const [ queryState, setQueryState ] = useState<'idle' | 'querying'>('idle');
	
	const [ title, setTitle ] = useState<string>('');
	const [ description, setDescription ] = useState<string>('');

	const createCampaign = async () => {
		if (queryState !== 'idle') return;
		setQueryState('querying');

		const res = await fetch('/data/campaign/new', {
			method: 'POST', cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ title, description })
		});
		
		setQueryState('idle');

		if (res.status !== 200) console.error(await res.text());
		else {
			const data = await res.json();
			await mergeData(data);
			history.push('/' + Format.identifier(title));
		}
	};

	return (
		<div class='NewCampaignForm'>
			<h2 class='NewCampaignForm-Title'>New Campaign</h2>

			<Label label='Campaign Title'>
				<Text value={title} setValue={setTitle} />
			</Label>

			<Label label='Campaign Description'>
				<Text class='NewCampaignForm-Description' long={true} value={description} setValue={setDescription} />
			</Label>

			<Button class='NewCampaignForm-Submit' onClick={createCampaign} icon='add' label='Create' disabled={!title} />
		</div>
	);
}

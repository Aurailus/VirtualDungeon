import * as Preact from 'preact';
import { useState } from 'preact/hooks';
import { useAppData } from '../../Hooks';
import { useHistory } from 'react-router-dom';

import './NewCampaignForm.sass';

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
			<label>
				<span>Campaign Title</span>
				<input class='NewCampaignForm-Title' value={title}
					onChange={(e: any) => setTitle(e.target.value )} />
			</label>
			<label>
				<span>Campaign Description</span>
				<textarea
					rows={3} placeholder='Lorem ipsum dolor sit amet...'
					class='NewCampaignForm-Description' value={description}
					onChange={(e: any) => setDescription(e.target.value)} />
			</label>

			<Button class='NewCampaignForm-Submit' onClick={createCampaign} icon='add' label='Create Campaign' disabled={!title} />
		</div>
	);
}

import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';

import './PlayerInviteForm.sass';

import Button from '../Button';
import { Label, Text, Checkbox } from '../input/Input';

interface Props {
	campaign: string;
}

export default function PlayerInviteForm({ campaign }: Props) {
	const [ invite, setInvite ] = useState<string>('');
	const [ querying, setQuerying ] = useState<boolean>(false);

	useEffect(() => {
		fetch('/data/invite/get', {
			method: 'POST', cache: 'no-cache',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ campaign })
		}).then(r => r.text()).then(r => setInvite(r));
	}, [ campaign ]);

	const refreshInviteLink = async (enabled: boolean) => {
		if (querying) return;
		setQuerying(true);

		const res = await fetch('/data/invite/refresh', {
			method: 'POST', cache: 'no-cache',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ campaign, enabled })
		});
		
		setQuerying(false);

		if (res.status !== 200) console.error(await res.text());
		else {
			const data = await res.text();
			setInvite(data);
		}
	};

	const enabled = invite !== '';

	return (
		<form class='PlayerInviteForm'>
			<h2 class='PlayerInviteForm-Title'>Invite Players</h2>
			<Label label='Invite Link'>
				<Checkbox value={enabled} setValue={refreshInviteLink} alignRight={true} />
			</Label>
			<div class={('PlayerInviteForm-LinkWrap ' + (enabled ? '' : 'Disabled')).trim()}>
				<Text value={'localhost:3000/app/c/join/' + invite}
					setValue={() => {/**/}} disabled={!enabled || querying} readonly={true} />
				<Button icon='refresh' label='Regenerate' disabled={!enabled || querying} onClick={() => refreshInviteLink(true)} />
			</div>
		</form>
	);
}

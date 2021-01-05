import * as Preact from 'preact';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'preact/hooks';

import './NewAssetForm.sass';

import { Label, Text } from '../input/Input';

import Button from '../Button';
import ButtonGroup from '../ButtonGroup';

import * as Format from '../../../../common/Format';

export default function NewAssetForm() {
	const history = useHistory();

	const [ queryState, setQueryState ] = useState<'idle' | 'querying'>('idle');
	
	const [ type, setType ] = useState<'wall' | 'ground' | 'token'>('token');
	const [ tokenType, setTokenType ] = useState<1 | 4 | 8>(4);

	const [ file, setFile ] = useState<File | null>(null);
	const [ filePreview, setFilePreview ] = useState<string | null>(null);

	const [ name, setName ] = useState<string>('');
	const [ identifier, setIdentifier ] = useState<string>('');

	const handleSetType = (type: 'wall' | 'ground' | 'token') => {
		setType(type);
	};

	const handleFileSet = (evt: any) => {
		const input = evt.target as HTMLInputElement;
		const newFile: File | undefined = input.files?.[0];

		if (!newFile || newFile.type !== 'image/png' || !newFile.name.endsWith('.png')) return setFile(null);

		setFile(newFile ?? null);
		setName(Format.name(newFile.name));
		setIdentifier(Format.identifier(Format.name(newFile.name)));
	};

	useEffect(() => {
		if (!file) return;

		let set = true;
		const reader = new FileReader();
		reader.onload = e => { if (set) setFilePreview((e.target as any).result); };
		reader.readAsDataURL(file);

		return () => set = false;
	}, [ file ]);

	const createCampaign = async () => {
		if (queryState !== 'idle' || !file) return;
		setQueryState('querying');

		let data = new FormData();
		data.append('file', file);

		data.append('type', type);
		if (type === 'token') data.append('tokenType', tokenType.toString());

		data.append('name', name);
		data.append('identifier', identifier);

		const res = await fetch('/data/asset/upload', {
			method: 'POST', cache: 'no-cache',
			body: data
		});

		if (res.status === 202) {
			console.log('hellyea!');
			history.push('/assets');
		}
		else {
			console.log('hellnah', await res.text());
			setQueryState('idle');
		}
	};

	return (
		<div class='NewAssetForm'>
			<h2 class='NewAssetForm-Title'>New Asset</h2>

			<div class='NewAssetForm-Col2'>
				<div>
					<Label label='Asset Type' />
					<ButtonGroup>
						<Button icon='token' label='Token' inactive={type !== 'token'} onClick={() => handleSetType('token')}/>
						<Button icon='ground' label='Ground' inactive={type !== 'ground'} onClick={() => handleSetType('ground')}/>
						<Button icon='wall' label='Wall' inactive={type !== 'wall'} onClick={() => handleSetType('wall')}/>
					</ButtonGroup>
				</div>
				{type === 'token' && <div>
					<Label label='Token Type' />
					<ButtonGroup>
						<Button icon='token_1' label='Single' inactive={tokenType !== 1} onClick={() => setTokenType(1)}/>
						<Button icon='token_4' label='4 Slice' inactive={tokenType !== 4} onClick={() => setTokenType(4)}/>
						<Button icon='token_8' label='8 Slice' inactive={tokenType !== 8} onClick={() => setTokenType(8)}/>
					</ButtonGroup>
				</div>}
			</div>

			<Label label='Asset'>
				<div class='NewAssetForm-UploadWrap'>
					<input type='file' class='NewAssetForm-Upload' accept='.png' onChange={handleFileSet} />
					<p class='NewAssetForm-UploadTitle'>Drag file here or click to Select</p>
				</div>
			</Label>

			{file && <Preact.Fragment>
				<div class='NewAssetForm-AssetPreview'>
					<div class='NewAssetForm-ImagePreviewWrap'>
						<div class='NewAssetForm-ImagePreview'>
							<img src={filePreview ?? undefined} alt='' />
						</div>
					</div>
					{type !== 'token' && <div class='NewAssetForm-TilePreviewWrap'>
						<div class={'NewAssetForm-TilePreview ' + type} style={{ backgroundImage: `url(${filePreview})` }}>
							<div /><div /><div />
							<div /><div /><div />
							<div /><div /><div />
						</div>
					</div>}
					{type === 'token' && <div class='NewAssetForm-TokenPreviewWrap'>
						<div class={'NewAssetForm-TokenPreview Slice' + tokenType.toString()} style={{ backgroundImage: `url(${filePreview})` }} />
					</div>}
				</div>
				<p class='NewAssetForm-AssetDisclaimer'>If the preview doesn't look correct,
					try changing the asset {type === 'token' ? 'or token' : ''} type!</p>

				<div class='NewAssetForm-Col2'>
					<Label label='Asset Name'>
						<Text value={name} setValue={setName} />
					</Label>

					<Label label='Asset Identifier'>
						<Text class='NewAssetForm-Identifier' long={true} value={identifier} setValue={setIdentifier} />
					</Label>
				</div>

				<Button class='NewAssetForm-Submit' onClick={createCampaign} icon='add' label={`Create ${Format.name(type)} Asset`}
					disabled={!(name.length > 3 && identifier.length > 3)} />
			</Preact.Fragment>}
		</div>
	);
}

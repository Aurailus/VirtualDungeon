import * as Preact from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

import './AssetUploadForm.sass';

import AssetPreview from './AssetPreview';
import { Label, Text, Numeric, Button, SelectRow, SelectRowItem } from '../input/Input';

import * as Format from '../../../../common/Format';
import { UploadData } from '../../../../common/DBStructs';

interface Props {
	file: File;
	preview: string;

	uploading: boolean;
	onCancel: () => void;
	onSubmit: (data: UploadData) => void;
}

export default function AssetUploadForm({ file, preview, uploading, onCancel, onSubmit }: Props) {
	const firstInputRef = useRef<HTMLInputElement>(null);

	const [ data, setData ] = useState<UploadData>({
		name: '', identifier: '',
		type: 'token', tokenType: 4, tileSize: { x: 1, y: 1 }
	});

	useEffect(() => {
		setData({ ...data,
			name: Format.name(file.name),
			identifier: ''
		});
		firstInputRef.current?.focus();
	}, [ file ]);

	const handleSetType = (type: 'wall' | 'floor' | 'detail' | 'token') => {
		const newData = { ...data, type: type } as any;

		if (newData.type === 'token') {
			// Delete token-specific data from the object.
			newData.tokenType = 4;
			newData.tileSize = { x: 4, y: 4 };
		}
		else {
			// Delete tile-specific data from the object.
			delete newData.tokenType;
			delete newData.tileSize;
		}

		setData(newData);
	};

	const handleSetIdentifier = (identifier: string) => {
		setData({ ...data, identifier: Format.identifier(identifier) });
	};

	return (
		<div class='AssetUploadForm'>
			<Label label='Asset Type' />
			<SelectRow value={data.type} setValue={handleSetType} disabled={uploading}>
				<SelectRowItem label='Token' name='token' />
				<SelectRowItem label='Floor' name='floor' />
				<SelectRowItem label='Detail' name='detail' />
				<SelectRowItem label='Wall' name='wall' />
			</SelectRow>

			<div class='AssetUploadForm-AssetPreview'>
				<div class='AssetUploadForm-ImagePreview'>
					<img src={preview ?? undefined} alt='' />
				</div>
				<AssetPreview {...data} path={preview} animate />
			</div>
			<p class='AssetUploadForm-Info'>If the preview doesn't look correct,
				try changing the asset type{data.type === 'token' ? ' or sprite layout' : ''}.</p>

			<div class='AssetUploadForm-Col2'>
				<Label label='Name'>
					<Text ref={firstInputRef} value={data.name} setValue={(name) => setData({ ...data, name})} disabled={uploading}/>
				</Label>

				<Label label='Identifier'>
					<Text class='AssetUploadForm-Identifier' long={true}
						value={data.identifier} placeholder={Format.identifier(data.name)}
						setValue={handleSetIdentifier} disabled={uploading}/>
				</Label>
			</div>

			{data.type === 'token' &&
				<div class='AssetUploadForm-Col2'>
					<div>
						<Label label='Sprite Layout' />
						<SelectRow value={data.tokenType} setValue={t => setData({ ...data, tokenType: t })} disabled={uploading}>
							<SelectRowItem label='1×1' name={1} />
							<SelectRowItem label='2×2' name={4} />
							<SelectRowItem label='3×3' name={8} />
						</SelectRow>
					</div>
					<Label label='Size In Tiles'>
						<Numeric value={data.tileSize.x} setValue={x => setData({ ...data, tileSize: { x, y: x }})} disabled={uploading} />
					</Label>
				</div>
			}

			<div class='AssetUploadForm-ActionRow'>
				<Button class='AssetUploadForm-Submit' altLabel onClick={() => onSubmit(data)}
					icon='add' label='Upload Asset' disabled={uploading ||
						!(data.name.trim().length >= 3 &&
						((data.identifier.replace(/_/g, ' ').trim().length === 0
							&& Format.identifier(data.name.trim()).length >= 3)
						|| data.identifier.replace(/_/g, ' ').trim().length >= 3))} />
				<Button class='AssetUploadForm-Cancel' altLabel altColor onClick={onCancel}
					label='Cancel' disabled={uploading} />
			</div>
		</div>
	);
}

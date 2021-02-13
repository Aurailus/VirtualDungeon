import * as Preact from 'preact';
import { useState, useEffect } from 'preact/hooks';

import './AssetUploader.sass';

import { Button } from '../input/Input';
import AssetUploadForm from './AssetUploadForm';

import { UploadData } from '../../../../common/DBStructs';


/**
 * Handles uploading assets.
 */

export default function AssetUploader() {
	const [ files, setFiles ] = useState<File[]>([]);
	const [ filePreview, setFilePreview ] = useState<string>('');
	const [ uploadStates, setUploadStates ] = useState<{ success: number; fail: number }>({ success: 0, fail: 0 });

	const [ uploading, setUploading ] = useState<boolean>(false);

	useEffect(() => {
		if (files.length < 1) return;
		let set = true;
		setFilePreview('');

		const reader = new FileReader();
		reader.readAsDataURL(files[0]);

		reader.onload = e => {
			if (set) setFilePreview((e.target as any).result);
		};
		
		return () => set = false;
	}, [ files ]);

	const handleReset = () => {
		setFiles([]);
		setUploadStates({ success: 0, fail: 0 });
	};

	const handleFileSelect = (evt: any) => {
		const newFiles = (Array.from((evt.target as HTMLInputElement).files ?? []) as File[])
			.filter(f => f.type === 'image/png' || f.name.endsWith('.png'));
		setFiles(newFiles);
	};
	
	const handleCancel = () => {
		const newFiles = [ ...files ];
		newFiles.splice(0, 1);
		setFiles(newFiles);
		setUploadStates(s => ({ ...s, fail: s.fail + 1 }));
	};

	const handleSubmit = async (data: UploadData) => {
		if (uploading) return;
		setUploading(true);

		let formData = new FormData();
		formData.append('file', files[0]);
		formData.append('data', JSON.stringify(data));

		const res = await fetch('/data/asset/upload',
			{ method: 'POST', cache: 'no-cache', body: formData });

		if (res.status === 200) {
			setUploadStates(s => ({ ...s, success: s.success + 1 }));
		}
		else {
			console.error(await res.text());
			setUploadStates(s => ({ ...s, fail: s.fail + 1 }));
		}

		const newFiles = [ ...files ];
		newFiles.splice(0, 1);
		setFiles(newFiles);
		setUploading(false);
	};

	return (
		<div class='AssetUploader'>
			{files.length === 0 && <Preact.Fragment>
				{uploadStates.success + uploadStates.fail === 0 && <Preact.Fragment>
					<div class='AssetUploader-UploadWrap'>
						<input type='file' id='fileUpload' class='AssetUploader-Upload' accept='.png' multiple onChange={handleFileSelect} />
						<label for='fileUpload' class='AssetUploader-UploadTitle'>Click or drag files here to upload!<br />
							<small>(Tip: You can select multiple assets at once to batch-upload)</small></label>
					</div>
					<div class='AssetUploader-ActionBar'>
						<Button label='Back to Assets' altLabel altColor to='../' />
					</div>
				</Preact.Fragment>}
				{uploadStates.success + uploadStates.fail > 0 && <Preact.Fragment>
					<div class='AssetUploader-ResultsCard'>
						<p class='AssetUploader-ResultsStatus'>Uploaded {uploadStates.success} asset{uploadStates.success !== 1 ? 's' : ''}.</p>
						<div class='AssetUploader-ActionBar'>
							<Button label='Upload More' altLabel onClick={handleReset} />
							<Button label='Back' altLabel altColor to='../' />
						</div>
					</div>
				</Preact.Fragment>}
			</Preact.Fragment>}

			{/* {files.length > 1 && <div class='AssetUploader-Progress'>
				<div class='AssetUploader-ProgressBar' style={{ width: current / files.length * 100 + '%'}} />
				<p class='AssetUploader-ProgressText'>{`Asset ${current + 1} / ${files.length}`}</p>
			</div>}*/}

			{files.length !== 0 && <div>
				<AssetUploadForm file={files[0]} preview={filePreview}
					uploading={uploading} onCancel={handleCancel} onSubmit={handleSubmit}/>
			</div>}
		</div>
	);
}

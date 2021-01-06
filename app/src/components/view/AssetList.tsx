import * as Preact from 'preact';

import './AssetList.sass';

import { Asset } from '../../../../common/DBStructs';

interface Props {
	assets: Asset[];

	newText?: string;
	onNew?: () => void;
	onClick: (user: string, identifier: string) => void;
}

export default function AssetList({ assets, newText, onNew, onClick }: Props) {
	return (
		<div class='AssetList'>
			{assets === undefined && <p>Loading Assets...</p>}
			{assets !== undefined &&
				<Preact.Fragment>
					<ul class='AssetList-Grid'>
						{assets.map(a => <li class='AssetList-AssetWrap'>
							<button class='AssetList-Asset' onClick={() => onClick(a.user, a.identifier)}>
								<div class='AssetList-AssetInner'>
									<div class='AssetList-AssetPreview'>
										<img src={'/app/asset/' + a.path} role='presentational' alt='' loading='lazy'/>
									</div>
									<p class='AssetList-AssetTitle'>{a.name || 'Untitled'}</p>
								</div>
							</button>
						</li>)}
						<li class='AssetList-AssetWrap'>
							{onNew && <button onClick={onNew} className='AssetList-NewAsset'>
								<img src='/app/static/ui/icon/asset_new.png' alt=''/>
								<p>{newText ?? 'Upload Asset'}</p>
							</button>}
						</li>
					</ul>
				</Preact.Fragment>
			}
		</div>
	);
}

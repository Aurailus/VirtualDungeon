import * as Preact from 'preact';

import './AssetList.sass';

import AssetPreview from './AssetPreview';

import { Asset } from '../../../../common/DBStructs';

interface Props {
	assets: Asset[];

	newText?: string;
	onNew?: () => void;
	onClick?: (user: string, identifier: string) => void;
}

export default function AssetList({ assets, newText, onNew, onClick }: Props) {
	return (
		<div class='AssetList'>
			{assets === undefined && <p>Loading Assets...</p>}
			{assets !== undefined &&
				<Preact.Fragment>
					<ul class='AssetList-Grid'>
						{onNew &&
							<li class='AssetList-AssetWrap'>
								<button onClick={onNew} className='AssetList-Asset AssetList-NewAsset'>
									<div class='AssetList-AssetInner'>
										<div class='AssetList-AssetPreview'>
											<img src='/app/static/icon/asset_new.png' role='presentational' alt=''/>
										</div>
										<p class='AssetList-AssetTitle'>{newText ?? 'Upload Asset'}</p>
									</div>
								</button>
							</li>
						}
						{assets.map(a => <li class='AssetList-AssetWrap'>
							<button class='AssetList-Asset' onClick={() => onClick?.(a.user, a.identifier)}>
								<div class='AssetList-AssetInner'>
									<AssetPreview type={a.type} tokenType={(a as any).tokenType} path={`/app/asset/${a.path}`} animate='hover' />
									<p class='AssetList-AssetTitle'>{a.name || 'Untitled'}</p>
								</div>
							</button>
						</li>)}
					</ul>
				</Preact.Fragment>
			}
		</div>
	);
}

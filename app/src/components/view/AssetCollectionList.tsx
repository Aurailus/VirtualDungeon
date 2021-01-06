import * as Preact from 'preact';

import './AssetCollectionList.sass';

import { AssetCollection } from '../../../../common/DBStructs';

interface Props {
	collections: AssetCollection[];
	onNew?: () => void;
	onClick: (user: string, identifier: string) => void;
}

export default function AssetCollectionList({ collections, onNew, onClick }: Props) {
	return (
		<div class='AssetCollectionList'>
			{collections === undefined && <p>Loading Collections...</p>}
			{collections !== undefined &&
				<Preact.Fragment>
					<ul class='AssetCollectionList-Grid'>
						{collections.map(c => <li class='AssetCollectionList-CollectionWrap'>
							<button class='AssetCollectionList-Collection' onClick={() => onClick(c.user, c.identifier)}>
								<div class='AssetCollectionList-CollectionInner'>
									<div class='AssetCollectionList-CollectionPreview'>
									</div>
									<p class='AssetCollectionList-CollectionTitle'>{c.name || 'Untitled'}</p>
								</div>
							</button>
						</li>)}
						<li class='AssetCollectionList-CollectionWrap'>
							{onNew && <button onClick={onNew} className='AssetCollectionList-NewCollection'>
								<img src='/app/static/ui/icon/asset_new.png' alt=''/>
								<p>Create New Collection</p>
							</button>}
						</li>
					</ul>
				</Preact.Fragment>
			}
		</div>
	);
}

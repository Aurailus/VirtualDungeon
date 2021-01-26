import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { NavLink as Link } from 'react-router-dom';

import './AssetCollectionList.sass';

import { AssetCollection } from '../../../../common/DBStructs';

function AssetCollectionItem({ collection }: { collection: AssetCollection }) {
	return (
		<li class='AssetCollectionList-AssetCollectionWrap'>
			<Link className='AssetCollectionList-AssetCollection' to={`/u/${collection.user}/a/${collection.identifier}`}>
				<div class='AssetCollectionList-AssetCollectionInner'>
					<div class='AssetCollectionList-AssetCollectionPreview'>
						<img src='https://placekitten.com/400/300' alt='' />
					</div>
					<div class='AssetCollectionList-AssetCollectionDetails'>
						<p class='AssetCollectionList-AssetCollectionTitle'>{collection.name || 'Untitled Collection'}</p>
						<div class='AssetCollectionList-AssetCollectionOwner'>
							<img src='/app/static/icon/profile.png' alt='' />
							<span>{collection.user}</span>
						</div>
					</div>
				</div>
			</Link>
		</li>
	);
};

interface Props {
	filter: 'all' | 'owner' | 'subscriber';
}

export default function AssetCollectionList({ filter }: Props) {
	const [ { user, collections } ] = useAppData([ 'user', 'collections' ]);

	if (!collections) return (
		<div class='AssetCollectionList'>
			<p>Loading Collections...</p>
		</div>
	);

	// This equivalency thing is wack! Draw up a truth table or something, you'll figure it out.
	const filtered = filter === 'all' ? collections : collections.filter(c => (filter === 'owner') === (c.user === user?.user));

	return (
		<div class='AssetCollectionList'>
			<ul class='AssetCollectionList-Grid'>
				{filtered.map(collection => <AssetCollectionItem collection={collection}/>)}
				{filter !== 'subscriber' && <li class='AssetCollectionList-AssetCollectionWrap'>
					<Link to='/a/new' className='AssetCollectionList-NewAssetCollection'>
						<img src='/app/static/icon/asset_new.png' alt=''/>
						<p>Create Collection</p>
					</Link>
				</li>}
				{filter !== 'owner' && <li class='AssetCollectionList-AssetCollectionWrap'>
					<Link to='/a/browse' className='AssetCollectionList-NewAssetCollection'>
						<img src='/app/static/icon/asset_new.png' alt=''/>
						<p>Browse Collections</p>
					</Link>
				</li>}
			</ul>
		</div>
	);

	// return (
	// 	<div class='AssetCollectionList'>
	// 		{collections === undefined && <p>Loading Collections...</p>}
	// 		{collections !== undefined &&
	// 			<Preact.Fragment>
	// 				<ul class='AssetCollectionList-Grid'>
	// 					{collections.map(c => <li class='AssetCollectionList-CollectionWrap'>
	// 						<button class='AssetCollectionList-Collection' onClick={() => onClick(c.user, c.identifier)}>
	// 							<div class='AssetCollectionList-CollectionInner'>
	// 								<div class='AssetCollectionList-CollectionPreview'>
	// 								</div>
	// 								<p class='AssetCollectionList-CollectionTitle'>{c.name || 'Untitled'}</p>
	// 							</div>
	// 						</button>
	// 					</li>)}
	// 					<li class='AssetCollectionList-CollectionWrap'>
	// 						{onNew && <button onClick={onNew} className='AssetCollectionList-NewCollection'>
	// 							<img src='/app/static/ui/icon/asset_new.png' alt=''/>
	// 							<p>Create New Collection</p>
	// 						</button>}
	// 					</li>
	// 				</ul>
	// 			</Preact.Fragment>
	// 		}
	// 	</div>
	// );
}

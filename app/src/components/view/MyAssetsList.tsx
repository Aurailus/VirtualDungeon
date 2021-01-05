import * as Preact from 'preact';
import { useAppData } from '../../Hooks';
import { NavLink as Link } from 'react-router-dom';

import './MyAssetsList.sass';

export default function MyAssetsList() {
	const [ { assets } ] = useAppData('assets');

	return (
		<div class='AssetsList'>
			{assets === undefined && <p>Loading Assets...</p>}
			{assets !== undefined &&
				<Preact.Fragment>
					<ul class='AssetsList-Grid'>
						{assets.map(a => <li class='AssetsList-AssetWrap'>
							<Link className='AssetsList-Asset' to={`/campaign/${a.identifier}`}>
								<div class='AssetsList-AssetInner'>
									<div class='AssetsList-AssetPreview'>
										<img src={'/app/asset/' + a.path} alt='' />
									</div>
									<p class='AssetsList-AssetTitle'>{a.name || 'Untitled'}</p>
								</div>
							</Link>
						</li>)}
						<li class='AssetsList-AssetWrap'>
							<Link className='AssetsList-NewAsset' to='/assets/new'>
								<img src='/app/static/ui/icon/asset_new.png' alt=''/>
								<p>Upload Asset</p>
							</Link>
						</li>
					</ul>
				</Preact.Fragment>
			}
		</div>
	);
}

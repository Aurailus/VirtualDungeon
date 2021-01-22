import * as Preact from 'preact';
import { NavLink as Link, useParams } from 'react-router-dom';

import './MapList.sass';

import { Map } from '../../../../common/DBStructs';

interface Props {
	maps: Map[];
}

export default function MapList({ maps }: Props) {
	const { user, campaign } = useParams<{ user: string; campaign: string }>();

	return (
		<div class='MapList'>
			{maps === undefined && <p>Loading Maps...</p>}
			{maps !== undefined &&
				<Preact.Fragment>
					<ul class='MapList-Grid'>
						{maps.map(m => <li class='MapList-MapWrap'>
							<Link className='MapList-Map' to={`/u/${user}/c/${campaign}/play?map=${m.identifier}`}>
								<div class='MapList-MapInner'>
									<div class='MapList-MapPreview'>
										<img src='https://placekitten.com/400/300' alt='' />
									</div>
									<p class='MapList-MapTitle'>{m.name || 'Untitled'}</p>
								</div>
							</Link>
						</li>)}
						<li class='MapList-MapWrap'>
							<Link className='MapList-NewMap' to={`/u/${user}/c/${campaign}/maps/new`}>
								<img src='/app/static/icon/map_new.png' alt=''/>
								<p>Create Map</p>
							</Link>
						</li>
					</ul>
				</Preact.Fragment>
			}
		</div>
	);
}

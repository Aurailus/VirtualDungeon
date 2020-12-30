import * as Preact from 'preact';
import { useState } from 'preact/hooks';
import { NavLink as Link, useRouteMatch } from 'react-router-dom';

import './MapList.sass';

import Button from '../Button';
import ButtonGroup from '../ButtonGroup';

import { Map } from '../../../../common/DBStructs';

const ITEMS_PER_PAGE = 8;

interface Props {
	maps: Map[];
	allowNew?: boolean;
}

export default function CampaignsCard({ maps, allowNew }: Props) {
	const match = useRouteMatch();

	const [ page, setPage ] = useState<number>(0);

	const currentMaps = maps.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

	return (
		<div class='MapList'>
			<h3>Maps</h3>

			<ul class='MapList-Grid'>
				{currentMaps.map(m => <li class='MapList-MapWrap'>
					<Link className='MapList-Map' to={`/${m.identifier}`}>
						<div class='MapList-MapInner'>
							<img class='MapList-MapPreview' src='https://placekitten.com/400/300' alt='' />
							<p class='MapList-MapTitle'>{m.name || 'Untitled'}</p>
						</div>
					</Link>
				</li>)}
			</ul>

			<div class='MapList-Actions'>
				<Button icon='add' alt='New Map' to={`${match.url}/new`} disabled={!allowNew} />
				
				{maps.length > ITEMS_PER_PAGE &&
					<ButtonGroup class='HomeView-Pagination'>
						<Button icon='nav_left' alt='Next Page'
							onClick={() => setPage(page - 1)} disabled={page === 0}/>
						
						{(() => {
							let elems: Preact.VNode[] = [];
							for (let i = 0; i < maps.length / ITEMS_PER_PAGE; i++) elems.push(
								<Button label={(i + 1).toString()} onClick={() => setPage(i)} disabled={page === i} />);
							return elems;
						})()}
						
						<Button icon='nav_right' alt='Next Page'
							onClick={() => setPage(page + 1)} disabled={page + 1 >= maps.length / ITEMS_PER_PAGE} />
					</ButtonGroup>
				}
			</div>
		</div>
	);
}

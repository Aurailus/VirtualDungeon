import * as Preact from 'preact';
import { useAppData } from '../../Hooks';

import './PlayerList.sass';

import PlayerInviteForm from './PlayerInviteForm';

interface Props {
	players: string[];
	campaign?: string;
	user?: string;
}

export default function PlayerList({ players, campaign, user }: Props) {
	const [ { user: self } ] = useAppData('user');

	return (
		<div class='PlayerList'>
			{(players.length !== 0 || !campaign) && <h2 class='PlayerList-Title'>Players</h2>}
			{players.length !== 0 &&
				<ul class='PlayerList-List'>
					{players.map((p: string) =>
						<li class='PlayerList-PlayerWrap'>
							<div class='PlayerList-Player'>
								<div class='PlayerList-PlayerImageWrap'>
									<div class='PlayerList-PlayerImage' style={{ backgroundImage: `url('${p}')` }}/>
								</div>
								<div class='PlayerList-PlayerDetails'>
									<h3 class='PlayerList-PlayerName'>{p}</h3>
								</div>
							</div>
						</li>
					)}
				</ul>
			}
			{campaign && user === self?.user && <PlayerInviteForm campaign={campaign} />}
		</div>
	);
}

import * as Preact from 'preact';

import './PlayerList.sass';

interface Player {
	name: string;
	sprite: string;
}

interface Props {
	players: Player[];
}

export default function PlayerList({ players }: Props) {
	return (
		<div class='PlayerList'>
			<ul class='PlayerList-List'>
				{players.map(p =>
					<li class='PlayerList-PlayerWrap'>
						<div class='PlayerList-Player'>
							<div class='PlayerList-PlayerImageWrap'>
								<div class='PlayerList-PlayerImage' style={{ backgroundImage: `url('${p.sprite}')` }}/>
							</div>
							<div class='PlayerList-PlayerDetails'>
								<h3 class='PlayerList-PlayerName'>{p.name}</h3>
							</div>
						</div>
					</li>
				)}
			</ul>
		</div>
	);
}

import * as Preact from 'preact';
import { bind } from './PreactComponent';
import { useState, useEffect, useCallback } from 'preact/hooks';

import './TokenCards.sass';

import Map from '../../map/Map';

import TokenCard from './TokenCard';
import { TokenMetaData } from '../../map/token/Token';

import { Asset } from '../../util/Asset';

interface Props {
	map: Map;
	assets: Asset[];
}

export default bind<Props>(function TokenCards({ map, assets }: Props) {
	const [ cards, setCards ] = useState<TokenMetaData[]>(map.tokens.getAllMeta());
	const [ pinned, setPinned ] = useState<string[]>([]);

	useEffect(() => {
		const eventCb = () => {
			setCards(JSON.parse(JSON.stringify(map.tokens.getAllMeta())));
		};
		
		map.tokens.event.bind(eventCb);
		return () => map.tokens.event.unbind(eventCb);
	}, []);

	const handleSetProps = (ind: number, data: Partial<TokenMetaData>) => {
		map.tokens.setMeta(cards[ind].uuid, data);
	};

	const handleSetPinned = useCallback((uuid: string, pin?: boolean) => {
		setPinned(pinned => {
			pin = pin ?? !pinned.includes(uuid);
			if (pin) {
				if (!pinned.includes(uuid)) return [ ...pinned, uuid ];
				return pinned;
			}
			else {
				const ind = pinned.indexOf(uuid);
				const n = [ ...pinned ];
				n.splice(ind, 1);
				return n;
			}
		});
	}, []);

	useEffect(() => {
		const fnKeyCallback = (evt: KeyboardEvent) => {
			if (evt.key[0] !== 'F' || evt.key.length !== 2 || !(evt.key.charCodeAt(1) >= '1'.charCodeAt(0) &&
				evt.key.charCodeAt(1) <= '8'.charCodeAt(0))) return;

			evt.preventDefault();
			evt.stopPropagation();

			const ind = Number.parseInt(evt.key.substr(1), 10);
			if (cards.length >= ind) handleSetPinned(cards[ind - 1].uuid);
		};

		window.addEventListener('keydown', fnKeyCallback);
		return () => window.removeEventListener('keydown', fnKeyCallback);
	}, [ cards ]);

	return (
		<div class='TokenCards'>
			{cards.map((c, i) => <TokenCard {...c}
				assets={assets}
				pinned={pinned.includes(c.uuid)}
				setProps={u => handleSetProps(i, u)}
				setPinned={p => handleSetPinned(c.uuid, p)}
			/>)}
		</div>
	);
});

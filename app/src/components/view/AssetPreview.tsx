import * as Preact from 'preact';

import './AssetPreview.sass';

interface TileProps {
	type: 'wall' | 'floor' | 'detail';
}

interface TokenProps {
	type: 'token';
	tokenType: 1 | 4 | 8;
}

type Props = {
	path: string;
	animate?: false | true | 'hover';
} & (TileProps | TokenProps);

export default function AssetPreview(props: Props) {
	const animClass = props.animate === true ? 'Anim' : props.animate === 'hover' ? 'AnimHover' : '';
	return (
		<div class='AssetPreview'>
			{props.type === 'token' ?
				<div class={'AssetPreview-Inner Token Slice' + (props.tokenType || 4).toString() + ' ' + animClass}>
					<div style={{ backgroundImage: `url(${props.path})` }} />
				</div> :
				<div class={'AssetPreview-Inner Tile ' + props.type} style={{ '--bg': `url(${props.path})` } as any}>
					<div /><div /><div />
					<div /><div /><div />
					<div /><div /><div />
				</div>
			}
		</div>
	);
}
